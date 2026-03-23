# 献立カレンダーアプリ モックアップ セットアップガイド

## 📦 プロジェクトセットアップ

### 1. プロジェクト作成

```bash
# portfolioディレクトリに移動
cd ~/work/gtn-74/portfolio

# Expoプロジェクト作成
npx create-expo-app@latest menuPlanApp-mobile --template blank-typescript

# プロジェクトディレクトリに移動
cd menuPlanApp-mobile
```

### 2. 依存ライブラリのインストール

```bash
# カレンダーライブラリ
npm install react-native-calendars

# ナビゲーション
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context

# 状態管理
npm install zustand

# ストレージ
npm install @react-native-async-storage/async-storage

# ボトムシート
npm install @gorhom/bottom-sheet

# アニメーション・ジェスチャー
npm install react-native-reanimated react-native-gesture-handler

# アイコン（Expo標準）
npm install @expo/vector-icons
```

### 3. babel.config.js の更新

`babel.config.js`を以下のように編集:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'], // ← 追加
  };
};
```

### 4. ファイル配置

ダウンロードした`src/`ディレクトリを`menuPlanApp-mobile/`直下に配置。

### 5. App.tsxの置き換え

ルートの`App.tsx`を提供されたファイルで置き換え。

### 6. アプリ起動

```bash
# 開発サーバー起動
npm start

# iOSシミュレータで起動
i

# Androidエミュレータで起動
a

# Expo Goアプリで起動
QRコードをスキャン
```

## 🎨 カスタマイズ

### カラーテーマの変更

`src/theme/colors.ts`を編集:

```typescript
export const colors = {
  primary: '#FF9800',  // ← メインカラー変更
  // ...
};
```

### モックデータの追加

`src/mocks/data.ts`にデータを追加:

```typescript
export const mockMenuItems: MenuItem[] = [
  // ここに献立データを追加
  {
    id: 'm8',
    date: '2026-01-25',
    name: '新しい献立',
    // ...
  },
];
```

## 📱 機能説明

### カレンダー表示
- ドット表示: オレンジ=献立、グリーン=家計簿、ブルー=個人予定、パープル=家族予定
- タップで日付選択
- 月移動可能

### ボトムシート
- 選択した日の詳細情報を表示
- スワイプで展開・折りたたみ
- 献立・家計簿・予定を確認

### フィルター
- 右上のフィルターアイコンから表示設定
- 選択状態はAsyncStorageに保存
- アプリ再起動後も設定維持

### タブナビゲーション
- カレンダー: メイン画面
- 献立: 献立一覧（今後実装）
- 家計簿: 家計簿一覧（今後実装）
- プロフィール: ユーザー設定（今後実装）

## 🔧 トラブルシューティング

### Metro Bundlerのキャッシュクリア

```bash
npm start -- --clear
```

### node_modulesの再インストール

```bash
rm -rf node_modules
npm install
```

### iOSシミュレータが起動しない

```bash
# Xcodeを起動してシミュレータを確認
open -a Simulator
```

### Androidエミュレータが起動しない

```bash
# Android Studioでエミュレータを確認
# AVD Managerから適切なデバイスを起動
```

## 📋 次のステップ

### Phase 1: モック完成（現在）
- ✅ カレンダー表示
- ✅ ボトムシート詳細
- ✅ フィルター機能
- ⬜ 献立追加画面
- ⬜ 編集・削除機能

### Phase 2: API連携
- ⬜ auth-serviceと接続
- ⬜ menu-serviceと接続
- ⬜ 実データ表示

### Phase 3: 追加機能
- ⬜ 写真アップロード
- ⬜ 買い物リスト連携
- ⬜ プッシュ通知

## 🎯 デモデータ

### 含まれている献立データ
- 1/18: チキンカレー
- 1/19: 豚の生姜焼き
- 1/20: ハンバーグ
- 1/21: サバの味噌煮
- 1/22: 親子丼
- 1/23: 野菜炒め
- 1/24: カツ丼

### 含まれている家計簿データ
- 食費・日用品・交通費の支出記録

### 含まれている予定データ
- 個人予定と家族予定の混在

## 📖 参考リソース

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Calendars](https://github.com/wix/react-native-calendars)
- [Zustand](https://github.com/pmndrs/zustand)
- [Bottom Sheet](https://github.com/gorhom/react-native-bottom-sheet)
