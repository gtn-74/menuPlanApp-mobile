# デザインハンドオフ

デザインツールから受け取ったハンドオフ一式を、実装の参照元としてそのまま保管する場所です。

| フォルダ | 内容 |
| --- | --- |
| `weekly-dinner-plan/` | 夕食の週間献立プラン（献立タブ拡張）。Epic とサブ issue の仕様の一次情報 |

## 使い方

- `<name>/README.md` が**仕様の一次情報**です。issue の受け入れ条件はここから引いています。
- `<name>/*.dc.html` は **HTML で作られたデザインリファレンス**（見た目と挙動を示すプロトタイプ）です。
  ブラウザで開くと全画面を実際にタップして操作できます（`support.js` を同じフォルダに置いたまま開いてください）。
  **そのまま移植するコードではありません** — React Native 側の作法に合わせて作り直します。
- `<name>/_ds/` はデザインシステムのトークン（CSS 変数）です。値は `src/theme/colors.ts` と一致しており、
  実装では **CSS 変数ではなく `colors` と `StyleSheet` を使います**。

## 実装時の読み替え

| ハンドオフ（Web） | このリポジトリ（React Native） |
| --- | --- |
| `var(--kp-primary)` などのトークン | `src/theme/colors.ts` の `colors.*` |
| `<ion-icon name="...">` | `@expo/vector-icons` の `Ionicons` |
| CSS / インラインスタイル | `*.styles.ts` の `StyleSheet.create`（#31 の方針） |
| `cubic-bezier(.4,0,.2,1)` / 200ms | `Animated` または `react-native-reanimated` |
