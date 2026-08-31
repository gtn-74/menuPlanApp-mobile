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
1. `createVersionedStorage` ＋ `MenuRepository`/`LocalMenuRepository` ＋ `menuStore` ＋テスト（UIなし）
2. 献立**作成**フォーム画面 ＋ CalendarScreen を menuStore 購読に（seed 込み）
3. **編集・削除**
4. MenuScreen 一覧（#8）
5. `ApiMenuRepository`＋MSW（#14）

## 10. API 移行パス
- `ApiMenuRepository` を実装し、DI 地点（menuStore 生成箇所）で差し替え。
- 応答は同じ `MenuItemSchema.parse` で検証（境界検証を再利用）。
- テストは MSW で HTTP をモック。

## 11. 確認事項（要決定）
- **A. 追加UI**: 既存ボトムシート内にフォーム？ それとも専用 `MenuAddScreen`（#4想定）？
- **B. 入力項目**: 現行 `MenuItem` は「料理名・予算・材料・写真」。#4 は「料理名・メモ・写真」。→ **予算・材料でいく**か、`description(メモ)` を足すか。
- **C. 初期シード**: 起動時に mocks の献立を投入する？ それとも**空スタート**？
- **D. 状態管理**: menuStore(Zustand) で進めてOK？（後で TanStack Query 移行前提）
