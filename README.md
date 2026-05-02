# 献立カレンダーアプリ モックアップ

家族で使える献立・家計簿・予定管理を統合したカレンダーアプリのモックアップ

## 🎨 主な機能

### カレンダー表示
- 📅 月間カレンダー表示
- 🔴 献立・家計簿・予定をドット表示
- 📱 日付タップで詳細表示

### フィルター機能
- ☑️ 献立の表示/非表示
- ☑️ 家計簿の表示/非表示
- ☑️ 個人予定の表示/非表示
- ☑️ 家族予定の表示/非表示
- 💾 設定を自動保存

### ボトムシート詳細
- 📝 選択日の献立一覧
- 💰 選択日の家計簿一覧
- 📆 選択日の予定一覧
- ↕️ スワイプで展開・折りたたみ

## 🚀 クイックスタート

詳細は`SETUP_GUIDE.md`を参照

```bash
cd ~/work/gtn-74/portfolio/menuPlanApp-mobile
npm install
npm start
```

## 🎨 デザイン仕様

- **カラーテーマ**: オレンジ系（温かみ）
- **献立**: 🟠 #FF9800
- **家計簿**: 🟢 #4CAF50
- **個人予定**: 🔵 #2196F3
- **家族予定**: 🟣 #9C27B0

## 📂 プロジェクト構造

```
src/
├── components/
│   ├── Calendar/          # カレンダー関連
│   ├── BottomSheet/       # ボトムシート
│   ├── Filter/            # フィルター
│   └── common/            # 共通コンポーネント
├── screens/               # 画面
├── navigation/            # ナビゲーション
├── stores/                # 状態管理（Zustand）
├── mocks/                 # モックデータ
├── types/                 # 型定義
└── theme/                 # テーマ設定
```

## 🛠️ 技術スタック

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State**: Zustand
- **Storage**: AsyncStorage
- **Calendar**: react-native-calendars
- **BottomSheet**: @gorhom/bottom-sheet

## 📱 スクリーンショット

[TODO: スクリーンショット追加]

## 🔜 今後の実装予定

### 認証・オンボーディング
- [ ] **OnboardingScreen** - 新規登録後のグループ選択画面（新しく作る／招待コードで参加）
- [ ] **GroupSetupScreen** - グループ名入力・初期メンバー設定
- [ ] **JoinGroupScreen** - 招待コード入力によるグループ参加（招待リンクのディープリンク対応含む）

### カレンダー・データ入力
- [ ] 献立追加・編集・削除
- [ ] 家計簿入力機能
- [ ] 予定追加機能
- [ ] 写真アップロード

### 未実装タブ画面
- [ ] **MenuScreen** - 献立一覧・管理
- [ ] **BudgetScreen** - 家計簿
- [ ] **ScheduleScreen** - 予定管理

### インフラ・その他
- [ ] API連携（auth-service, menu-service）
- [ ] 買い物リスト生成
- [ ] プッシュ通知

## 📝 ライセンス

Private

## 👤 Author

gtn74
