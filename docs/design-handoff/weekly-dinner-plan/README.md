# Handoff: 夕食の週間献立プラン（献立タブ拡張）

対象リポジトリ: **gtn-74/menuPlanApp-mobile**（branch `develop`） / React Native + Expo + TypeScript + Zustand

---

## Overview

既存の「献立プラン」アプリに、**夕食に特化した週間献立プラン**を追加する設計です。既存の4タブ構成（カレンダー／献立／家計簿／予定）は変えず、`献立` タブ配下に4つのサブ画面（週プラン・冷蔵庫・食べたい・買い物）を追加し、カレンダー／家計簿へはデータが流れ込むだけ、という接続にしています。

新しい体験は3つです。

1. **献立の自動提案** — 冷蔵庫の期限・家族の投票・買い足し点数をスコア化して候補を出す
2. **1週間まとめて作り置き** — 空いている日を一括で埋め、作り置き可の献立をまとめて提示
3. **家族の「食べたい」リクエスト投票** — 投票数が提案スコアに反映される

## About the Design Files

このフォルダの `週間献立プラン.dc.html` は **HTMLで作られたデザインリファレンス**（見た目と挙動を示すプロトタイプ）です。**そのまま移植するコードではありません。**

実装タスクは、このHTMLの画面を **リポジトリ既存の環境（React Native + Expo / TypeScript / Zustand / react-native-calendars / @gorhom/bottom-sheet / @expo/vector-icons）** の作法に合わせて作り直すことです。スタイルは `StyleSheet.create`、色は `src/theme/colors.ts`、アイコンは `Ionicons` を使ってください（HTML側の `var(--kp-*)` トークンや `<ion-icon>` はWeb用の代替です）。

ブラウザで `週間献立プラン.dc.html` を開くと、実際にタップして全画面を操作できます（`support.js` を同じフォルダに置いたままにしてください）。

## Fidelity

**High-fidelity（hifi）** です。色・タイプスケール・余白・角丸・モーションは確定値として扱ってください。数値は既存アプリの StyleSheet に合わせているので、既存コンポーネントと重複する箇所は **既存実装を優先**してください（新しい色は追加していません）。

---

## Screens / Views

### 0. ナビゲーション構造（最重要）

```
MainTabParamList
├─ Calendar   カレンダー … 既存の月表示（献立ドット＋9pxの料理名チップを追加）
├─ Menu       献立       … ★ 新規スタック（下記4画面＋2プッシュ画面）
├─ Budget     家計簿     … 既存（献立から食費レコードが流れ込む）
└─ Schedule   予定       … 既存（予定＋Todo）

Menu タブ内（画面上部のサブナビ chips で切替。
 createMaterialTopTabNavigator か 自前 chips + 単一 screen のどちらでも可）
├─ WeekPlan   週プラン（ホーム）
├─ Fridge     冷蔵庫
├─ Requests   食べたい
└─ Shopping   買い物
push で開く画面（ヘッダーに chevron-back）
├─ MenuSuggest  { date }             献立の提案
└─ RecipeDetail { recipeId, date }   レシピ
```

サブナビの chips は横スクロール（`flexShrink: 0`・1行固定）。アクティブはオレンジ塗り、非アクティブはグレー面。
`献立` タブのアイコンには **買い物の未チェック数**をバッジ表示（赤 `#F44336`、15px円、9px/700）。

### 1. カレンダー（既存画面の拡張）

- 目的: 月全体を見て、日付から日別詳細へ入る。
- レイアウト: `28px + 7列`（左28pxの週番号レール）。曜日見出しは12px/500、日曜 `#F44336`、土曜 `#2196F3`、他 `#757575`。行の区切りは1px `#F5F5F5`。
- セル: 高さ58px、中央寄せの縦積み。日付バッジは24px円（13px/500）、今日はオレンジ塗り＋白文字。その下に **5pxドットを横並び（最大4個）**、さらに下に **9px/1.2 の料理名チップ**（`#F57C00`、1行 ellipsis）。
- ドット色: 献立 `#FF9800` / 家計簿 `#4CAF50` / 個人予定 `#2196F3` / 家族予定 `#9C27B0` / Todo `#E91E63`（`colors.dots` と一致）。
- 下部に凡例（7pxドット＋11px `#757575`）と「今週の夕食プラン」への遷移カード。
- **日付タップ → 日別詳細ボトムシート**（次項）。献立だけに飛ばさないこと。

### 2. 日別詳細ボトムシート（@gorhom/bottom-sheet）

- 高さ: コンテンツ領域の86%。**タブバー（約70px）の上で止める**こと（フッターに被せない）。
- 見た目: 上角 `borderRadius: 20`、`shadowOffset {0,-4} blur 12 rgba(0,0,0,.10)`、上部に 40×4 のハンドル（`#E0E0E0`）。スライドアップ 300ms `cubic-bezier(.4,0,.2,1)`。背景は `rgba(0,0,0,.32)`（タップで閉じる）。
- ヘッダー: `1月13日（火）` 18px/700、右に `close` 24px `#757575`。下に1px `#E0E0E0`。
- セクション（既存 `DayScheduleList` の表現を流用）: **予定 → 献立 → 家計簿 → Todo** の順。各行は左に4px幅のカテゴリー色インジケーター（角丸2・min-height 40）、meta 12px `#757575`、title 15px/500 `#333`、subtitle 13px `#757575`、右に金額（`#4CAF50`）や優先度バッジ（高 `#F44336` ／中 `#FF9800` ／低 `#9E9E9E`）。
- **献立セクションは常に表示**。未定の日は「まだ決まっていません」（インジケーター `#E0E0E0`）で、タップで提案画面へ。
- フッター: プライマリ `献立を決める`（未定時・icon `sparkles`）／`レシピを見る`（決定済・icon `restaurant-outline`）＋ セカンダリ `＋予定`。

### 3. 週プラン（献立タブのホーム）

- サマリーカード（白・角丸12・`shadow 0 1px 3px rgba(0,0,0,.08)`・padding 16）: 「今週の夕食」15px/600 ＋「n/7日 決定」13px `#757575` ／ 食費見込み `¥3,720 / ¥5,000`（14px/600）／ 6px高の進捗バー（`#4CAF50`、トラック `#F5F5F5`、width transition 300ms）／ ボタン2つ（`まとめて提案`＝sm・primary・icon `sparkles`・flex:1、`買い物リスト`＝sm・secondary・icon `cart-outline`）。
- 作り置きバナー: `#FFE0B2` 角丸12、`time-outline` `#F57C00`、13px/600 ＋ 12px `#8A6D3B`、右に `chevron-forward`。
- 日カード（7枚）: 白・角丸12・1px `#E0E0E0`・padding 12/14・gap 12。左42px列に曜日（11px/500、日=赤・土=青）＋日付バッジ30px円（今日はオレンジ塗り）。中央に 4×14 のオレンジバー＋料理名15px/500、下に材料3つを「、」連結 12px `#757575`。右に金額 13px/600 `#4CAF50`。未定の日は `add-circle-outline`（オレンジ）＋「献立を決める」14px `#9E9E9E`。
- 表示時に fade-in（opacity 0→1・translateY 8→0・240ms）。RN では `Animated` か reanimated の `FadeInDown`。

### 4. 献立の提案

- ヘッダー行: 「1月14日（水）の夕食」14px `#757575` ＋ 右に `他の候補`（`refresh` 16px、13px/500 オレンジ）。
- 候補カード3枚: 48px角丸12の `#FFE0B2` 枠に `restaurant` 24px `#F57C00`（写真は将来機能なのでプレースホルダー）、料理名16px/600、meta「20分 ・ 5品の材料 ・ 4人分」12px `#757575`、右に金額15px/600 `#4CAF50`。
- **根拠チップ**（11px/500・角丸4・padding 4/8・最大3個）: 期限間近 `#F44336` on `#FFEBEE` ／ 投票 `#E91E63` on `#FCE4EC` ／ 買い足し `#4CAF50` on `#E8F5E9` ／ 作り置き `#F57C00` on `#FFF3E0` ／ その他 `#757575` on `#F5F5F5`。
- ボタン: `この献立にする`（primary・block）＋ `レシピ`（secondary）。
- 最下部に破線ボーダー（1px dashed `#E0E0E0`）の「家族のリクエストから選ぶ」。

### 5. レシピ

- ヘッダーブロック（白）: 64px角丸12のサムネ枠、料理名18px/700、meta「20分 ・ ¥780 ・ 4人分」13px、タグ3つ（`夕食`＝オレンジ塗り／`作り置き可`＝`#F57C00` on `#FFF3E0`／`時短`＝`#2196F3` on `#E3F2FD`）。その下に `#F5F5F5` の投票行（`heart` `#E91E63` ＋ 12px本文 ＋ 22px円アバターを -4px で重ねる）。
- 材料セクション: 「材料（4人分）」15px/600 ＋ 右に「買い足し n品」。各行は `checkmark-circle`（`#4CAF50`＝冷蔵庫にあり）／`cart-outline`（`#F57C00`＝買う ¥n）、1px `#E0E0E0` 区切り。**在庫判定はプロトタイプでは材料名の先頭トークン一致**で行っています → 実装では食材マスタIDで突合してください。
- 作り方: 22px円（`#FFE0B2` / `#F57C00` 12px/700）＋ 14px/1.6 本文。
- 下部に primary ボタン `この日の献立にする`（icon `calendar-outline`）。

### 6. 冷蔵庫

- 先頭に期限アラートカード（`alert-circle` 26px `#F44336`、14px/600 ＋ 12px サブ、右に sm primary `提案`）。
- カテゴリー別カード（野菜 `leaf-outline` `#4CAF50` ／ 肉・魚 `fish-outline` `#F44336` ／ その他 `cube-outline` `#2196F3` ／ 調味料 `flask-outline` `#9C27B0`）。行は4pxインジケーター＋名称14px＋数量12px＋期限バッジ（今日まで・2日以内＝`#F44336` on `#FFEBEE`、あとn日＝`#F57C00` on `#FFF3E0`、十分＝`#9E9E9E` on `#F5F5F5`）。
- 行タップで「使い切り」トグル（取り消し線＋`#BDBDBD`）。提案スコアと買い物リストに即反映。

### 7. 食べたい（投票）

- 説明カード＋家族アバター（40px円・名前付き）。
- リクエスト行: 料理名15px/500、`太郎がリクエスト・1月10日` 12px、右にハートボタン（投票済 `heart` `#E91E63` on `#FCE4EC` ／ 未投票 `heart-outline` `#9E9E9E` on `#F5F5F5`、下に票数11px/600）、その右に36px角丸8の `calendar-outline` ボタン（＝この料理で提案を開く）。
- 投票数の降順ソート。最下部に破線の「食べたいものをリクエスト」。

### 8. 買い物

- 進捗カード（`n/m品`、6pxバー `#4CAF50`、「合計 約¥2,140（冷蔵庫にある材料は除いています）」）。
- カテゴリー別カード。行は `square-outline`／`checkbox`（20px、済は `#4CAF50`）＋名称14px＋「豚の生姜焼き・肉じゃが に使います」11px `#BDBDBD`＋価格13px。
- **リストは週プランの献立から自動生成**（planned な献立の材料のうち冷蔵庫に無いものを名称で集約し、用途を配列で保持）。

### 9. 家計簿 / 予定（既存画面への接続）

- 家計簿: 「1月の食費」カード（金額20px/700 `#4CAF50`、月予算に対する進捗バー）＋「献立からの記録（今週）」＝ `ListItem tone="budget"` 相当で `1月12日（月） / 豚の生姜焼き / 食費 ・ 材料5品 / −¥780`。既存の家計簿レコードと同じ構造で扱うこと（献立保存時に食費レコードを起票するか、参照ビューにするかは実装判断）。
- 予定: 既存のまま。Todoは `square-outline`／`checkbox` トグル＋優先度バッジ（高/中/低）。

---

## Interactions & Behavior

| 操作 | 挙動 |
| --- | --- |
| カレンダーの日付タップ | 日別詳細シートを開く（献立が無い日も開く） |
| シートの献立行／CTA | 決定済→レシピ、未定→提案（`date` を渡す） |
| 週プランの日カード | 決定済→レシピ、未定→提案 |
| 提案の「この献立にする」 | `plan[date] = recipeId` を保存 → 週プランへ戻り、トースト「1月14日（水）を「肉じゃが」にしました」 |
| 「まとめて提案」 | 空き日をスコア上位から重複なしで一括割当。トースト「n日分の献立を提案しました」 |
| 「他の候補」 | 候補リストのオフセットを1つ進める（既に使った献立は除外） |
| 冷蔵庫の行タップ | 使い切りトグル → 提案スコア・買い物リストを再計算 |
| ハートタップ | 投票±1（自分の投票のみ変更可）→ 提案スコアに反映 |
| 買い物のチェック | 進捗バーと献立タブのバッジを更新 |
| トースト | 画面下（タブバー上86px）に1.9秒、角丸20、`rgba(51,51,51,.94)`、13px/500 白 |

モーションは全て `cubic-bezier(.4,0,.2,1)`：通常200ms、ボトムシート300ms、カード表示240ms。バウンスや装飾ループは使わない。押下はブランド色を変えずに `brightness(0.93)` 相当、無効は opacity 0.45。

## State Management（Zustand）

既存 `menuStore` を拡張し、以下を追加する想定です（`src/stores/`）。

```ts
// planStore: 日付→献立の割当（週プランの真実源）
plan: Record<string /* 'YYYY-MM-DD' */, string /* recipeId */>
assign(date, recipeId), clear(date), autoFillWeek(weekStart)

// fridgeStore: 在庫
items: { id, name, qty, category, expiresAt }[]
consume(id), restore(id)      // 使い切りトグル
expiringSoon(days = 2)        // 期限アラート

// requestStore: 食べたい投票
requests: { id, name, recipeId, requestedBy, createdAt }[]
votes: Record<requestId, userId[]>
toggleVote(requestId, userId)

// derived（features 層の純関数として実装＋テスト）
buildShoppingList(plan, fridge)        // 不足材料を名称集約＋用途配列
suggestScore(recipe, fridge, votes)    // 在庫一致×2 + 票数×1.5 + 期限間近材料×4
```

UI ローカル state: `activeSubTab`, `sheetDate`, `suggestOffset`, `checkedShoppingIds`, `toast`。
永続化は既存 `src/utils/storage.ts` のパターンに合わせ、API 化時に `features/*/xxxRepository.ts` を差し替える構成（`menuRepository` と同じ）にしてください。

**データモデルの追加提案**: 現在の `MenuItem`（date / name / budget / ingredients / photos）に対し、

- `mealType: 'dinner' | 'lunch' | 'school'`（今回は `dinner` のみ使用。拡張余地として定義）
- `ingredients` を `{ name, category, price }[]` に構造化（買い物リストと在庫突合に必須）
- `steps: string[]`, `batchCookable: boolean`, `cookMinutes: number`

を追加すると上記UIがそのまま成立します（zod スキーマ `src/schemas/domain.ts` / `src/schemas/menu.ts` を更新）。

## Design Tokens

すべて `src/theme/colors.ts` の既存値です（新色なし）。

- primary `#FF9800` / dark `#F57C00` / light `#FFB74D` / tint `#FFE0B2`
- カテゴリー: menu `#FF9800` / budget `#4CAF50` / personalEvent `#2196F3` / familyEvent `#9C27B0` / todo `#E91E63`
- ニュートラル: text `#333333` / textSecondary `#757575` / textLight `#BDBDBD` / border `#E0E0E0` / backgroundSecondary `#F5F5F5` / background `#FFFFFF`
- セマンティック: error `#F44336` / success `#4CAF50` / info `#2196F3`。淡色面は `#FFEBEE` / `#E8F5E9` / `#E3F2FD` / `#FFF3E0` / `#FCE4EC`
- スペーシング: 4 / 8 / 12 / 16 / 20 / 24（4pxグリッド）
- タイプ: 28・18・16・15・14・13・12・11・9px、weight 400/500/600/700（ネイティブはシステムフォント）
- 角丸: 4（チップ・インジケーター）／8（ボタン・トリガー）／12（入力・カード）／20（シート上角）／円（アバター・日付バッジ）
- シャドウ: card `0 1px 3px rgba(0,0,0,.08)` ／ popover `0 4px 12px rgba(0,0,0,.15)` ／ sheet `0 -4px 12px rgba(0,0,0,.10)`
- カードは「1pxボーダー」か「シャドウ」のどちらか片方のみ

## Assets

画像アセットはありません。アイコンは **Ionicons のみ**（`@expo/vector-icons`）: `calendar(-outline)`, `restaurant(-outline)`, `wallet(-outline)`, `time(-outline)`, `cube-outline`, `heart(-outline)`, `cart(-outline)`, `sparkles`, `refresh`, `checkmark-circle`, `checkbox`, `square-outline`, `alert-circle`, `leaf-outline`, `fish-outline`, `flask-outline`, `chevron-back/forward/down`, `close`, `add`, `add-circle-outline`, `person`, `person-circle-outline`。
料理写真は将来機能のため、`#FFE0B2` の角丸枠＋`restaurant` グリフのプレースホルダーで代替しています。

## Files

- `週間献立プラン.dc.html` — 全画面のインタラクティブなデザインリファレンス（ブラウザで開いて操作可）
- `support.js` — 上記HTMLを動かすためのランタイム（実装には不要）
- 参照した既存実装: `src/theme/colors.ts`, `src/components/DayScheduleList/DayScheduleList.tsx`, `src/components/Calendar/CalendarView.tsx`, `src/components/common/Header.tsx`, `src/screens/CalendarScreen.tsx`, `src/screens/MenuAddScreen.tsx`, `src/schemas/domain.ts`, `src/schemas/menu.ts`, `src/stores/menuStore.ts`, `src/features/menu/menuRepository.ts`

---

## 実装の進め方（Claude Code への指示例）

1. `src/schemas/domain.ts` / `menu.ts` に `mealType`・構造化 `ingredients`・`steps`・`batchCookable`・`cookMinutes` を追加（既存データはデフォルト値でマイグレーション）
2. `src/stores/planStore.ts` / `fridgeStore.ts` / `requestStore.ts` と、`src/features/suggest/suggestScore.ts`・`src/features/shopping/buildShoppingList.ts` を追加（純関数はユニットテスト付き、既存 `buildMarkedDates.test.ts` と同じ粒度で）
3. `献立` タブを stack 化し、サブナビ chips ＋ `WeekPlanScreen` を実装
4. `MenuSuggestScreen` / `RecipeDetailScreen` を実装（`MenuAddScreen` のフォーム作法・zod バリデーションを踏襲）
5. `FridgeScreen` / `RequestsScreen` / `ShoppingScreen` を実装
6. `CalendarScreen` に日別詳細ボトムシート（@gorhom/bottom-sheet・86%・タブバーに被せない）を接続し、`buildMarkedDates` に献立ドット＋料理名チップを追加
7. 家計簿への食費レコード連携を実装。`予定` タブは既存のまま

既存コンポーネント（`Header`, `Dot`, `UserFilterButton`, `DayScheduleList`, `CalendarLayout`）は再実装せず再利用してください。
