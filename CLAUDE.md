# CLAUDE.md — menuPlanApp-mobile

## プロジェクト概要

家族で使える献立・家計簿・予定管理を統合したカレンダーアプリ（React Native / Expo）。
現在はモックアップ段階。将来的に AWS Cognito 認証 + バックエンド API と連携予定。

## Git 管理ルール

### ブランチ命名

```
feature/<issue番号>-<kebab-case-の機能名>
fix/<issue番号>-<kebab-case-のバグ名>
chore/<issue番号>-<kebab-case-の作業名>
```

例:
- `feature/1-onboarding-screen`
- `fix/14-bottom-sheet-height`
- `chore/0-setup-eslint`

### コミットメッセージ

Conventional Commits 形式を使用する。

```
feat: 新機能
fix: バグ修正
chore: ビルド・ツール・設定変更
docs: ドキュメント変更
refactor: リファクタリング（機能変更なし）
test: テスト追加・修正
```

### プルリクエスト

- **main への直接 push 禁止**。必ず PR 経由でマージする。
- PR 本文に `Closes #<issue番号>` を必ず記載して issue とリンクする。
- PR タイトルはコミットメッセージと同じ形式（例: `feat: OnboardingScreen 実装`）。
- PR のセルフレビュー後にマージ。

### issue 番号とブランチの対応

README.md の実装予定は GitHub issue として管理している。
新規作業を開始する際は対応する issue 番号をブランチ名に含める。

現在の issue 一覧:
- #1 OnboardingScreen
- #2 GroupSetupScreen
- #3 JoinGroupScreen
- #4 献立追加・編集・削除
- #5 家計簿入力機能
- #6 予定追加機能
- #7 写真アップロード
- #8 MenuScreen
- #9 BudgetScreen
- #10 ScheduleScreen
- #11 API連携
- #12 買い物リスト生成
- #13 プッシュ通知

## 技術スタック

- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript
- **Navigation**: React Navigation (bottom-tabs + native-stack)
- **State**: Zustand + AsyncStorage
- **Calendar**: react-native-calendars
- **BottomSheet**: @gorhom/bottom-sheet v5
- **Icons**: @expo/vector-icons (Ionicons)

## デザイン規約

- カラーテーマは `src/theme/colors.ts` の colors を使用
- primary: `#FF9800`（オレンジ）
- 入力フィールド: `borderRadius: 12`、背景 `backgroundSecondary`
- KeyboardAvoidingView で iOS/Android キーボード対応

## 利用可能な Skills / MCP

### Skills（Callstack）
- `react-native-best-practices` — RN ベストプラクティス
- `upgrading-react-native` — RN バージョンアップ手順
- `react-native-brownfield-migration` — ネイティブ統合ガイド
- `github` / `github-actions` — GitHub 操作・CI 設定

### Skills（Vercel）
- `vercel-react-native-skills` — RN 開発パターン
- `vercel-react-best-practices` — React ベストプラクティス
- `vercel-composition-patterns` — コンポーネント設計パターン
- `web-design-guidelines` — デザインガイドライン

### MCP サーバー
- `metro-mcp` — 実行中アプリへの接続・デバッグ（Metro bundler 経由）
