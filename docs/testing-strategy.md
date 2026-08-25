# テスト戦略（Atomic Design × ツール）

> ゴール: 「どの層を・何で・どこまでテストするか」を固定し、迷いを無くす。
> 原則: **テストが書きにくい ＝ 設計を見直すサイン**。ロジックはコンポーネントから出す。

## 3 つのランナー（住み分け）

| コマンド | ツール | 担当 | 対象ファイル |
| --- | --- | --- | --- |
| `npm test` | **Vitest**（node） | 純ロジック・store | `src/**/*.test.ts` |
| `npm run test:components` | **jest-expo + RNTL** | コンポーネント描画/操作 | `src/**/*.test.tsx` |
| `npm run test:e2e` | **Playwright**（Expo web） | 画面フロー・VRT | `e2e/**/*.spec.ts` |

拡張子で住み分ける（`.test.ts` = vitest / `.test.tsx` = jest）ので、両ランナーが衝突しない。

## 層とツールの対応

| 層 | 例 | テスト観点 | ツール |
| --- | --- | --- | --- |
| **純ロジック** | `buildMarkedDates`, `formatDateJa` | 入力→出力。境界値・組み合わせ網羅 | Vitest |
| **atoms** | `Dot` | props→見た目の写像、デフォルト値 | RNTL |
| **molecules** | `UserFilterButton` | props表示＋1操作(onPress)＋状態反映 | RNTL |
| **organisms** | `DayScheduleList` | 子の合成・空状態・件数での出し分け | RNTL |
| **templates** | 画面レイアウトの器（状態・遷移なし） | 構造/配置・propsの伝播 | RNTL（浅く） |
| **pages** | `CalendarScreen`（store/navi/実データ結線） | フロー・遷移・**VRT** | Playwright |

### templates と pages の線引き（判断基準）
**「状態・データ取得・画面遷移を持つか」** の一点で切る。
- 持たない＝レイアウトの器 → **RNTL で構造テスト**（速い・多くてよい）
- 持つ＝結線された画面 → **Playwright で 1〜数本のフロー**（遅い・少なく）

templates を「props だけ受ける薄い器」に保てば迷いが消える。**迷う＝template にロジックが漏れているサイン**。

## VRT（Visual Regression Testing）
スクショを撮って前回と画素差分で「見た目の崩れ」を検出する。値の回帰を守る単体テストに対し、**表示崩れ**（色・余白・折返し・はみ出し）を守る。
- pages/templates の見た目 → **Playwright `toHaveScreenshot()`**（新ツール不要）
- 基準更新: `npx playwright test --update-snapshots`
- 注意: フォント差で誤検知しやすい → `animations:'disabled'` や `maxDiffPixelRatio` で吸収、対象を絞る
- 参考: RNTL の `toJSON()` スナップショット＝**要素ツリー**の回帰（画素ではない、安価な補助）

## このリポジトリの実例（Calendar 縦スライス）
1 機能を各層で 1〜2 個ずつ実装し、層ごとのテストの型を通しで示している。

| 層 | 実装 | テスト |
| --- | --- | --- |
| 純ロジック | [buildMarkedDates.ts](../src/features/calendar/buildMarkedDates.ts), [date.ts](../src/utils/date.ts) | [buildMarkedDates.test.ts](../src/features/calendar/buildMarkedDates.test.ts), [date.test.ts](../src/utils/date.test.ts) |
| atom | [Dot.tsx](../src/components/atoms/Dot.tsx) | [Dot.test.tsx](../src/components/atoms/Dot.test.tsx) |
| molecule | [UserFilterButton.tsx](../src/components/molecules/UserFilterButton.tsx) | [UserFilterButton.test.tsx](../src/components/molecules/UserFilterButton.test.tsx) |
| organism | [DayScheduleList.tsx](../src/components/DayScheduleList/DayScheduleList.tsx) | [DayScheduleList.test.tsx](../src/components/DayScheduleList/DayScheduleList.test.tsx) |
| page + VRT | [CalendarScreen.tsx](../src/screens/CalendarScreen.tsx) | [calendar.spec.ts](../e2e/calendar.spec.ts) |

### この過程で行った「テストのための設計変更」
- `CalendarScreen` の `useMemo`（約65行）に埋まっていたドット生成を純関数 `buildMarkedDates` へ抽出 → vitest で網羅可能に。
- `CalendarScreen` と `DayScheduleList` に**重複**していた日付整形を `formatDateJa` に一本化（片方だけ直すデグレを防止）。
- インラインのユーザーフィルタを molecule `UserFilterButton` に切り出し → 単体で操作テスト可能に。

## まだやっていないこと（次の候補）
- templates 層の明示的な抽出（`CalendarLayout` として器を分離）
- コンポーネント単位の VRT（Storybook + Chromatic など、必要になったら）
- `filterStore` の vitest テスト（AsyncStorage モック）
