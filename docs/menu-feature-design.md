# 献立機能 要件定義・設計（local-first）

> 関連: #4（献立CRUD）/ #8（MenuScreen）/ #47（zod）/ #33（MSW）/ #14（API）

## 1. 目的・背景
バックエンド API 未完のため、**AsyncStorage をデータソースとして先行実装（local-first）**し、
「献立を作る → カレンダーに反映 → 再起動しても残る」というコアループを実データで完成させる。
API 到着後は **repository の実装差し替えのみ**で昇格できる形にし、UI は不変に保つ。

## 2. スコープ
### やる（第1弾）
- カレンダーの日付から**献立の追加 / 編集 / 削除**
- **AsyncStorage への永続化**（zod 検証・スキーマ version 付き）
- **CalendarScreen が repository を購読**し、作成した献立がドット/ラベルに反映
### やらない（後続）
- MenuScreen 一覧・検索（#8）… 第1弾の後
- 家族共有 / 複数端末同期 / push … **サーバ必須のため対象外**
- 写真の**サーバアップロード**（ローカルの画像URI保持まで）
- 実 API 接続（#14）… repository 差し替えで対応

## 3. ユーザーストーリー
- ユーザーとして、カレンダーの日付をタップして献立を追加できる
- 料理名・予算・材料（・写真）を入力して保存できる
- 既存の献立をタップして編集できる
- 献立を削除できる（確認あり）
- アプリを再起動しても献立が残っている

## 4. データモデル
既存の **`MenuItemSchema`（src/schemas/domain.ts）を単一の真実源**として再利用。
```
MenuItem = { id, date(YYYY-MM-DD), name, budget:number,
             ingredients:string[], photos:string[],
             userId, familyGroupId, createdAt }
```
- `id`: **クライアント生成（uuid）**。※将来 API 同期時に「クライアントID↔サーバID」の突合が必要（本格対応は #14 時）。
- `createdAt`: ISO datetime（作成時に付与）。
- 保存形式: `MenuItem[]` を1キーに格納（後述）。

## 5. アーキテクチャ
```
Create/EditMenu screen ──┐
CalendarScreen ──────────┤ useMenus()（hook）
                         ↓ 依存は interface のみ
                 MenuRepository (interface)
                   getForMonth(ym) / getForDate / create / update / remove / seedIfEmpty
                   ├─ LocalMenuRepository  … AsyncStorage + zod（今）
                   └─ ApiMenuRepository    … fetch + zod（#14 で追加）
```
- **UI/フックは interface だけに依存**。AsyncStorage を screen から直接叩かない。
- 状態は当面 **Zustand `menuStore`（repository をラップ）** or hook 内 useState。まずは menuStore で `items` を保持し load/mutation を repository 経由に（filterStore と同型）。API 化時に TanStack Query へ移行しやすい粒度にする。

## 6. 永続化設計（重要）
ユーザー生成データは**壊れても黙って捨てない**。フィルタ用の `createTypedStorage`（parse失敗→null→既定値）とは別に、
**`createVersionedStorage`** を新設：
```
{ version: number, data: T }   // 保存エンベロープ
- get: version を見て migrate → zod 検証 → 失敗時はバックアップキーへ退避して空で継続（データロスを最小化）
- set: 常に最新 version で保存
```
- キー: `@menuPlanApp:menus:v1`
- migration: version 不一致時に変換関数を通す（初期は v1 のみ）
- **初期シード**: 空の場合のみ `mocks/data.ts` の献立を1回投入（`seedIfEmpty`）。以降はユーザーデータが真実。

## 7. 画面・UX フロー
- CalendarScreen 日付タップ → 既存のボトムシート内 or 専用フォーム（**確認事項A**）
- フォーム入力（zod でバリデーション。auth と同じ `firstFieldErrors` 流用）
- 保存 → repository.create → menuStore 更新 → **カレンダーのドット/ラベルが即反映**
- 既存献立タップ → 同フォームで編集（update）
- 削除 → 確認ダイアログ → remove

## 8. テスト
- **LocalMenuRepository**: vitest（AsyncStorage をモック）で CRUD・seed・migration・壊れ値退避
- **createVersionedStorage**: vitest（version 不一致→migrate、壊れ値→退避）
- **フォームの zod スキーマ**: vitest（必須/型/日付形式）
- **フォーム component**: RNTL（入力→onSubmit、エラー表示）
- **フロー**: Playwright（作成→カレンダー反映）… E2E 整備後

## 9. 段階（PR 分割）
1. ✅ `createVersionedStorage` ＋ `MenuRepository`/`LocalMenuRepository` ＋ `menuStore` ＋テスト（UIなし）
2. ✅ 献立**作成**フォーム画面 ＋ CalendarScreen を menuStore 購読に
3. ✅ **編集・削除**（`MenuAddScreen` が menuId の有無で追加/編集を兼ねる）
4. ✅ MenuScreen 一覧（#8）… 日別/週別＋クイック追加
5. `ApiMenuRepository`＋MSW（#14）

## 10. API 移行パス
- `ApiMenuRepository` を実装し、DI 地点（menuStore 生成箇所）で差し替え。
- 応答は同じ `MenuItemSchema.parse` で検証（境界検証を再利用）。
- テストは MSW で HTTP をモック。

## 11. 確認事項（決定済み）
- **A. 追加UI**: 専用 `MenuAddScreen`（モーダル）＋ MenuScreen 内のインライン「クイック追加」の2本立て。
- **B. 入力項目**: **予算・材料でいく**（`description` は足さない）。ただし**予算は任意**。
- **C. 初期シード**: 空スタート。`seedIfEmpty` は実装しない（mocks は家計簿/予定/Todo の表示用に残る）。
- **D. 状態管理**: menuStore(Zustand) で進める（後で TanStack Query 移行前提）。

## 12. MenuScreen（#8）の決定事項
段階4（MenuScreen 一覧）にあたって決めたこと。

### 表示単位
- **食事区分（朝/昼/夕）は持たない**。1日に献立を**フラットに複数件**ぶら下げる。
  → `MenuItemSchema` は変更なし、ストレージの migration も不要（v1 のまま）。
  → 将来入れる場合は `mealType` 追加＋ v1→v2 migration（既存データは「夕食」に寄せる）で対応する。
- **日別**（1日を深く）と**週別**（7日を見渡す）をタブで切り替える。

### 週別ビューのレイアウト
- **7列の表グリッド**。ただし画面幅を7等分すると1列 50px 前後になり料理名がほぼ読めないため、
  **列幅は固定（150px）＋横スクロール**とする（`MenuWeekBoard.styles.ts` の `WEEK_COLUMN_WIDTH`）。
- 縦スクロールは画面側の `ScrollView` が持ち、横スクロールは週ボードが持つ（入れ子は逆方向なので競合しない）。
- 週の起点は**日曜**（カレンダー画面の react-native-calendars に合わせる）。

### 登録フロー
- **クイック追加**: 料理名だけ入力して即保存（`quickAddToDraft` → `budget: 0`）。週を一気に埋める用途。
  週別ビューでは「追加」を押した列にだけ入力欄が開く（7列ぶん常時表示すると狭い列が埋まるため）。
- **詳細フォーム**: `MenuAddScreen` で予算・材料まで入力。既存の献立をタップすると同じ画面が編集モードで開く。
- これに伴い `menuFormSchema` の **budget を任意**にした（未入力＝0。"abc"/"-1" は従来どおりエラー）。

### 日付ユーティリティ
- `new Date('YYYY-MM-DD')` は **UTC 深夜**にパースされ、UTC より西のタイムゾーンで日付が1日ずれる。
  週の切り出しで致命的なので、`utils/date.ts` に**ローカル正午起点でパースする `parseDateKey`** を置き、
  `formatDateJa` も含めて全てそれを使う（日本時間での結果は従来と同じ）。

### 実装した範囲
段階3（編集・削除）と段階4（MenuScreen）をまとめて実施。写真と API 連携は引き続き後続。
