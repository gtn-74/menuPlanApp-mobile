---
title: "テスト文化を、現場に輸入する"
emoji: "🧪"
type: "tech"
topics: ["reactnative", "expo", "vitest", "jest", "playwright"]
published: false
---

> テストを書く習慣がない現場から抜け出したい。手動確認だけが「テスト」で、デグレが止まらない。個人開発の Expo / React Native アプリを実験台に、**tsgo・Vitest・jest-expo・Playwright** を入れながら「テスト観点」と「テストしやすい設計」を身体で覚えた記録。

## 「動作確認 = 人間」からの脱出

今いる現場にはテストコードを書く文化がない。品質保証は人の目視だ。最近デグレが多くて、正直しんどい。テスト文化のある現場に移りたいと思っていて、そのためにまず自分がテストを書く習慣を身につけたい。

ずっと引っかかっていた言葉がある。**「テストが書きにくいのは、設計が悪いから」**。本当だろうか。手を動かして確かめることにした。題材は自作の献立プランアプリ（Expo SDK 54 / React Native 0.81 / React 19）。

## まず、走らせる場所を用意する

いきなりテストを書く前に、3つの土台を入れた。それぞれ役割が違う。

- **型チェック** — TypeScript 7 のネイティブ版 `tsgo`（`@typescript/native-preview`）。`npm run typecheck` で高速に。
- **単体テスト** — `Vitest`。純粋なロジック用。
- **E2E** — `Playwright`。ブラウザ（Expo web）で画面フローを検証。

> **memo — 「TypeScript 7」の正体**
> 安定版の `typescript` はまだ 5.x。世に言う「TS7」は Go 実装の新コンパイラ `tsgo` のプレビュー版で、`@typescript/native-preview` として配布されている。エディタ拡張と併せて型チェック専用に使い、安定版 5.9 も残す構成にした。

## 「テストが書きにくい」は本当だった

最初にテストを付けようとして、すぐ壁にぶつかった。カレンダー画面の「日付ごとの色ドット」を計算するロジックが、**コンポーネントの `useMemo` の中に約65行べた書き**されていたのだ。これを検証するには画面をまるごと描画するしかない。まさに「書きにくい＝設計のサイン」。

```tsx
// src/screens/CalendarScreen.tsx（before）
// 画面の中に計算が埋まっている → 単体テストできない
const markedDates = useMemo(() => {
  const marked = {};
  const allDates = new Set();
  if (showMenu) filteredMenuItems.forEach(i => allDates.add(i.date));
  // …65行つづく…
  return marked;
}, [/* 依存もりだくさん */]);
```

やったことは単純。**純粋関数として外に出す**だけ。入力（フィルタ済みデータ・表示フラグ・選択日）から出力（マーク済み日付）への写像に切り離す。

```ts
// src/features/calendar/buildMarkedDates.ts（after）
export function buildMarkedDates(input: BuildMarkedDatesInput): MarkedDates {
  const { menus, budgets, events, todos, flags, selectedDate } = input;
  // …画面に依存しない純粋な計算だけ…
  return marked;
}
```

こうなればテストは書きたい放題だ。フラグの ON/OFF ×データの有無×選択日を、描画ゼロで一瞬で回せる。

```ts
// src/features/calendar/buildMarkedDates.test.ts
it('同じ日に複数カテゴリがあるとドットが順番に積まれる', () => {
  const marked = buildMarkedDates({ /* … */ });
  expect(marked[d].dots?.map(x => x.key)).toEqual([
    'menu', 'budget', 'personalEvent', 'familyEvent', 'todo',
  ]);
});

it('選択日はデータが無くても必ずマークされる', () => {
  const marked = buildMarkedDates({ ...empty, flags: ALL_ON, selectedDate: '2026-01-01' });
  expect(marked['2026-01-01']).toEqual({ selected: true, selectedColor: colors.selectedDay });
});
```

> **win — 重複は片方だけ直すとデグレる**
> ついでに気づいた。日付を「M月D日（曜）」に整形する関数が `CalendarScreen` と `DayScheduleList` に**コピペで2つ**あった。これぞデグレの温床。`formatDateJa()` に一本化して、両方から呼ぶようにした。

## Vitest に Testing Library は「入っていない」

コンポーネントの描画テストに進んだところで、自分の思い込みが露呈した。「Vitest だけでコンポーネントも試せた気がする、Testing Library 同梱だっけ？」——違った。

- **Vitest は jest 不要**。`expect` / `vi` を自前で持つ独立ランナー。純ロジックは jest ゼロで回る。
- ただし **Testing Library は Vitest に同梱されていない**。別パッケージ群（`@testing-library/react` / `react-native` / `dom`）だ。
- 問題は assertion ではなく **「React Native を描画する土台」**。`@testing-library/react-native`（RNTL = React Native Testing Library）は RN 環境とトランスフォームが要る。それを用意してくれるのが公式プリセットの **jest-expo**。

Vitest には公式の RN プリセットがない。だから RN コンポーネントは jest-expo に任せ、拡張子で住み分けることにした——`*.test.ts` は Vitest、`*.test.tsx` は jest。

## バージョンの地雷原

ここが一番ハマった。RN のテスト環境はバージョンの噛み合わせが本当にシビアで、「最新を入れる」が全部裏目に出た。

> **trap 1 — jest-expo 54 は jest 30 で壊れる**
> 気を利かせて `jest@30` を入れたら `clearMocksOnScope is not a function` で全滅。jest-expo 54 の中身は **jest 29 系**（babel-jest 29.7.0）だった。`jest@29` に固定して解決。

> **trap 2 — RNTL 14 は react 19.1 で render が無反応**
> 最新の RNTL 14 だと `render()` が何も返さず `screen` も未初期化。react 19.1 と噛み合っていなかった。**RNTL 13.3.3** に下げて解決。

> **trap 3 — react-test-renderer は「^」で浮く**
> `react-test-renderer@^19.1.0` が 19.2.x に浮き、react 19.2 を要求して ERESOLVE。**厳密に `19.1.0` ピン**で固定。

教訓：RN のテスト依存は「Expo SDK に合わせて固定」が正解。最新を追わない。

```text
最終的に噛み合った組み合わせ
jest-expo             ~54.0.0   ← SDK に追従
jest                  ^29.7.0   ← 30 はNG
@testing-library/react-native  13.3.3   ← 14 はNG
react-test-renderer   19.1.0    ← ^ を付けない
```

## 層が大きくなると、どこを何でテストする？

関数のテストは分かる。分からなかったのは、コンポーネントが `atoms → molecules → organisms → templates → pages` と大きくなったとき、**どの層を・どのツールで**見るのか。特に `templates` は Playwright なのか Vitest なのか、いつも迷っていた。整理したのがこれ。

| 層 | 例 | テスト観点 | ツール |
|---|---|---|---|
| 純ロジック | `buildMarkedDates` | 入力→出力・境界値・組合せ網羅 | Vitest |
| atoms | `Dot` | props→見た目の写像・既定値 | RNTL |
| molecules | `UserFilterButton` | 表示＋1操作(onPress)＋状態反映 | RNTL |
| organisms | `DayScheduleList` | 子の合成・空状態・件数で出し分け | RNTL |
| templates | 画面レイアウトの器 | 構造/配置・propsの伝播（状態なし） | RNTL（浅く） |
| pages | `CalendarScreen` | フロー・遷移・見た目(VRT) | Playwright |

### templates と pages の境界線

迷いを消す基準はひとつだった。**「状態・データ取得・画面遷移を持つか」**。

- 持たない＝レイアウトの器 → **RNTL で構造テスト**（速い・多くてよい）
- 持つ＝結線された画面 → **Playwright で数本のフロー**（遅い・少なく）

つまり `templates` を「props だけ受ける薄い器」に保てば迷わない。**迷うということは、template にロジックが漏れているサイン**だった。ここでも結局「テストしにくさ＝設計」に戻ってくる。

```tsx
// molecule を RNTL で（操作の発火を見る）
it('タップすると onPress が呼ばれる', () => {
  const onPress = jest.fn();
  render(<UserFilterButton name="ママ" isVisible onPress={onPress} testID="btn" />);
  fireEvent.press(screen.getByTestId('btn'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
```

## VRT って何だったのか

名前だけ知っていた VRT（Visual Regression Testing）。中身は **「スクショを撮って前回と画素で見比べる」**テストだった。値の回帰を守る単体テストに対し、VRT は**見た目の回帰**——色・余白・折返し・はみ出しといった、人の目でしか気づけない崩れを守る。

新しいツールは要らなかった。すでに入れた **Playwright のスクショ機能**で page / template から始めるのが最小コスト。

```tsx
// e2e/calendar.spec.ts
test('VRT: カレンダー画面の見た目が崩れていない', async ({ page }) => {
  await expect(page).toHaveScreenshot('calendar-screen.png', {
    animations: 'disabled',      // アニメを止めて誤検知を減らす
    maxDiffPixelRatio: 0.01,     // フォント差の軽微なノイズを吸収
  });
});
```

> **memo — 「構造スナップショット」と混同しない**
> RNTL の `toJSON()` スナップショットは**要素ツリー**の回帰（画素ではない、安価な補助）。VRT は**画素**の回帰（本物の見た目、コスト高）。別物として使い分ける。
>
> なお VRT の基準画像は**プラットフォーム依存**（`-chromium-darwin` など）。CI(Linux) では別基準になるので、CI では Docker 等で撮り直すのが定石。更新は `npx playwright test --update-snapshots`。

## どのコンポーネントを、どう変えたか

「テストのための設計変更」を、実際に触ったソースの before / after で通しで追う。核心はひとつ——**画面から出した部分＝テストできる部分**。`CalendarScreen`（415行の全部入り）から4つを抜き、画面自身は薄くなった。

```text
CalendarScreen（before: 415行の全部入り）
  ├─ ドット計算 65行  ──▶ features/calendar/buildMarkedDates.ts   (vitest)
  ├─ 日付整形(重複)   ──▶ utils/date.ts :: formatDateJa           (vitest)
  ├─ フィルタ map 30行 ──▶ components/molecules/UserFilterButton  (RNTL)
  └─ 配置の器         ──▶ components/templates/CalendarLayout     (RNTL)
CalendarScreen（after: 呼び出すだけの薄い page）──▶ Playwright (+VRT)
```

### ① ドット生成ロジック → 純関数 `buildMarkedDates`

画面の `useMemo` に約65行あった計算を丸ごと外へ。

```tsx
// before — CalendarScreen.tsx
const markedDates = useMemo(() => {
  const marked = {};
  const allDates = new Set();
  if (showMenu) filteredMenuItems.forEach(i => allDates.add(i.date));
  // …日付収集 → 各日付にドット判定… 65行つづく…
  if (!marked[selectedDate]) marked[selectedDate] = { selected: true };
  return marked;
}, [/* 依存もりだくさん */]);
```

```tsx
// after — CalendarScreen.tsx（「呼ぶだけ」に痩せた）
const markedDates = useMemo(() => buildMarkedDates({
  menus: filteredMenuItems, budgets: filteredBudgetItems,
  events: filteredEvents, todos: filteredTodoItems,
  flags: { showMenu, showBudget, showPersonalEvents, showFamilyEvents, showTodo },
  selectedDate,
}), [/* 同じ依存 */]);
```

ロジックは新規 `features/calendar/buildMarkedDates.ts`（画面依存ゼロ）へ。おかげで描画せずに組み合わせを網羅できる → `expect(marked[d].dots.map(x=>x.key)).toEqual(['menu','budget',…])`（vitest）。

### ② 重複した日付整形 → `formatDateJa`

同じ関数が `CalendarScreen` と `DayScheduleList` に**コピペで2つ**あった。

```tsx
// before — 2ファイルに同じものが別々に
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const weekdays = ['日','月','火','水','木','金','土'];
  return `${date.getMonth()+1}月${date.getDate()}日（${weekdays[date.getDay()]}）`;
};
```

```tsx
// after — utils/date.ts に一本化、両方から呼ぶ
// CalendarScreen からは formatDateHeader が丸ごと消滅
// DayScheduleList の formatDate も消滅
<Text>{formatDateJa(selectedDate)}</Text>
```

曜日境界も1箇所で守れる：`expect(formatDateJa('2026-01-04')).toBe('1月4日（日）')`。

### ③ インラインの `map` → molecule `UserFilterButton`

フィルタボタンが `map` の中に30行べた書きだった。

```tsx
// before — CalendarScreen.tsx
{mockUsers.filter(...).slice(0,5).map((user) => {
  const isVisible = visibleUserIds.includes(user.id);
  return (
    <TouchableOpacity onPress={() => toggleUserVisibility(user.id)} style={[...]}>
      <View style={[styles.userFilterAvatar, !isVisible && ...]}>
        <Ionicons name="person" ... />
      </View>
      <Text style={[...]}>{user.name}</Text>
    </TouchableOpacity>
  );
})}
```

```tsx
// after — 部品化して呼び出しは4行
{mockUsers.filter(...).slice(0,5).map((user) => (
  <UserFilterButton key={user.id} name={user.name}
    isVisible={visibleUserIds.includes(user.id)}
    onPress={() => toggleUserVisibility(user.id)} />
))}
```

「押したら発火」を単体で：`fireEvent.press(...); expect(onPress).toHaveBeenCalledTimes(1)`（RNTL）。

### ④ レイアウトの器 → template `CalendarLayout`

`return` の `SafeAreaView` 入れ子（配置）を、状態を持たない器に分離。

```tsx
// before — CalendarScreen.tsx の return
return (
  <SafeAreaView style={styles.container}>
    <Header ... />
    <View style={styles.calendarContainer}><CalendarView ... /></View>
    <View style={styles.userFilterContainer}>{/* filters */}</View>
    <BottomSheet ...>...</BottomSheet>
  </SafeAreaView>
);
```

```tsx
// after — 中身を slot で渡すだけ
return (
  <CalendarLayout
    header={<Header ... />}
    calendar={<CalendarView ... />}
    userFilter={mockUsers.filter(...).map(...)}
    sheet={<BottomSheet ...>...</BottomSheet>}
  />
);
```

「どの領域に何が入るか」を構造で：`expect(getByTestId('region-header')).toContainElement(getByText('ヘッダー'))`（RNTL）。重い `BottomSheet` は page 側に残し、template は器だけに保つ。

### ⑤ 新規 atom `Dot`

これだけは既存コードの移動ではなく新規追加。最小の表示部品の例として、props を見た目に写像するだけの `Dot` を作り、「props→style」だけを軽くテストした。

> **腹落ちポイント**
> `CalendarScreen` 自体はどんどん薄くなり、残った“結線”だけを Playwright で見る。**抜き出した瞬間に、その部分はテストできるようになる**——これが「テストしにくい＝設計」の裏返しだった。

## できあがった三層

最終的に、役割の違う3つのランナーに落ち着いた。テストピラミッドがそのまま道具の住み分けになる。

```text
     ▲  Playwright         pages / フロー・VRT（少数）
    ▲▲  jest-expo + RNTL   atoms〜templates / 描画・操作（そこそこ）
   ▲▲▲  Vitest             純ロジック・store（多数・最速）
```

- `tsgo` typecheck **PASS**
- Vitest **9 passed**
- jest + RNTL **14 passed**
- Playwright **5 passed**（VRT 基準画像込み）

Calendar 機能を縦に1枚だけスライスして、各層に1〜2個ずつテストを置いた。全部は作らない。まず「型」を通して、層とツールの境界を具体例で腹落ちさせるのが目的だった。

## 学んだこと

- **「テストが書きにくい＝設計のサイン」は本当**。画面に埋まったロジックを純関数に出すだけで、テストは一気に書けるようになる。
- **ツールは層で住み分ける**。Vitest=ロジック、jest-expo+RNTL=描画、Playwright=フロー/VRT。無理に1つに寄せない。
- **templates と pages は「状態を持つか」で切る**。迷いはロジック漏れの警告。
- **RN のテスト依存はバージョン固定が命**。最新を追うと壊れる。SDK に合わせる。

### 次にやること

- `App.tsx` のテスト観点での分割（`getTabIcon()` の純関数化、認証ゲートを props で受ける `RootGate` に分離）
- `filterStore` の Vitest テスト（AsyncStorage をモック）
- コンポーネント単位の VRT（Storybook + Chromatic が欲しくなったら）

---

テスト文化は、いきなり全部は輸入できない。でも「1枚のスライス」から始めれば、設計を見る目も一緒に育つ。次の現場に持っていくのは、テストの書き方そのものより、たぶんこの視点だ。
