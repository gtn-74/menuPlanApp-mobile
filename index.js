import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent は AppRegistry.registerComponent('main', () => App) を呼び、
// Expo Go / ネイティブビルドのどちらでも環境設定を行う。
// pnpm の hoisted 構成では expo/AppEntry.js からの相対解決が壊れるため、
// ルート直下に明示的なエントリを置く。
registerRootComponent(App);
