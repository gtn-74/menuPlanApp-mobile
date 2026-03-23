# AuthService 認証画面の実装

- **実施日**: 2026-02-07
- **ステータス**: 完了

---

## 指示内容

現在のモバイルアプリ（menuPlanApp-mobile）には認証画面が一切実装されていない。
App.tsx では直接 TabNavigator（メイン画面）に遷移しており、ログイン/サインアップのフローが存在しない。
要件定義書では AWS Cognito による認証が想定されているが、現段階ではモック実装として認証画面のUIを作成する。

---

## 実装計画

### 1. 認証画面ファイルの作成

#### `src/screens/auth/LoginScreen.tsx`（ログイン画面）
- メールアドレス入力フィールド
- パスワード入力フィールド（目のアイコンで表示/非表示切替）
- ログインボタン
- 「パスワードを忘れた方はこちら」リンク → ForgotPasswordScreen へ
- 「アカウントをお持ちでない方」→ SignUpScreen へ
- アプリロゴ/アイコンを上部に表示
- バリデーション（メール形式、パスワード6文字以上）
- モック認証（固定値でログイン成功を模擬）

#### `src/screens/auth/SignUpScreen.tsx`（サインアップ画面）
- 表示名入力フィールド
- メールアドレス入力フィールド
- パスワード入力フィールド
- パスワード確認入力フィールド
- サインアップボタン
- 「既にアカウントをお持ちの方」→ LoginScreen へ
- バリデーション（メール形式、パスワード一致、6文字以上）
- モック登録（Alert で成功を表示し、LoginScreen に戻る）

#### `src/screens/auth/ForgotPasswordScreen.tsx`（パスワードリセット画面）
- メールアドレス入力フィールド
- リセットメール送信ボタン
- 「ログインに戻る」リンク
- モック送信（Alert で送信完了を表示）

### 2. 認証状態管理の作成

#### `src/stores/authStore.ts`（Zustand ストア）
- `isAuthenticated: boolean` — ログイン状態
- `user: { id, name, email } | null` — ログイン中のユーザー情報
- `isLoading: boolean` — 認証状態読み込み中フラグ
- `login(email, password)` — モックログイン
- `signup(name, email, password)` — モックサインアップ
- `logout()` — ログアウト
- `loadAuth()` — AsyncStorage から認証状態を復元
- AsyncStorage に認証状態を永続化

### 3. App.tsx の更新

- 認証状態に応じて AuthNavigator / MainNavigator を切り替える
- **AuthNavigator**: LoginScreen → SignUpScreen / ForgotPasswordScreen
- **MainNavigator**: 既存の TabNavigator + ProfileScreen（変更なし）
- authStore の `isAuthenticated` を監視し、自動的に画面切り替え
- 読み込み中は ActivityIndicator を表示

### 4. ProfileScreen のログアウト連携

- 既存のログアウトボタンの onPress を `authStore.logout()` に接続
- ログアウトすると AuthNavigator（ログイン画面）に自動遷移

---

## 成果物

### 新規作成ファイル

| ファイル | 内容 |
|---------|------|
| `src/stores/authStore.ts` | Zustand + AsyncStorage による認証状態管理ストア |
| `src/screens/auth/LoginScreen.tsx` | ログイン画面（メール/パスワードバリデーション、目アイコンによるパスワード表示切替、ロゴ表示） |
| `src/screens/auth/SignUpScreen.tsx` | サインアップ画面（表示名/メール/パスワード/パスワード確認の4フィールド + バリデーション） |
| `src/screens/auth/ForgotPasswordScreen.tsx` | パスワードリセット画面（メール入力 + モック送信Alert） |

### 編集ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/types/index.ts` | `AuthStackParamList` 型を追加 |
| `App.tsx` | `AuthNavigator` / `MainNavigator` の条件分岐、`useAuthStore` による認証状態監視、読み込み中のローディング表示 |
| `src/screens/ProfileScreen.tsx` | `useAuthStore` をインポートし、ログアウトボタンを `authStore.logout()` に接続 |

---

## 既存パターンの再利用

- **テーマカラー**: `src/theme/colors.ts` の colors を使用（primary: #FF9800）
- **アイコン**: `@expo/vector-icons` の Ionicons
- **状態管理**: Zustand（filterStore.ts と同じパターン）
- **永続化**: `@react-native-async-storage/async-storage`
- **ナビゲーション**: `@react-navigation/native-stack`（型付き）

## UI デザイン方針

- 既存のプロフィール画面のスタイルと統一感を持たせる
- colors.primary（#FF9800 オレンジ）をアクセントカラーに使用
- 白ベースのクリーンなデザイン
- 入力フィールドは角丸ボーダー（borderRadius: 12）、背景色 backgroundSecondary
- KeyboardAvoidingView で iOS/Android のキーボード対応

---

## 検証方法

1. `npx expo start` でアプリ起動
2. 初回はログイン画面が表示されることを確認
3. サインアップ画面への遷移を確認
4. パスワードリセット画面への遷移を確認
5. モックログイン → メイン画面へ遷移を確認
6. プロフィール画面のログアウト → ログイン画面に戻ることを確認
7. アプリ再起動後もログイン状態が維持されることを確認

## 備考

- 現段階はモック実装。認証ロジックは常に成功を返す
- 将来的に AWS Cognito に差し替える際は `authStore.ts` の `login` / `signup` / `logout` の中身を置き換えればよい
- TypeScript 型チェック通過済み（認証関連エラーなし）
