import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-native-web-vite';

// dev(rolldown)の依存事前バンドルが expo 系の型 re-export で落ちるため、
// それらを optimizeDeps から除外し、transpile 側で処理させる。
const EXPO_MODULES = ['expo-modules-core', 'expo-font', 'expo-asset', 'expo'];

// @expo/vector-icons は expo-modules-core を経由し Vite dev で実行時に落ちるため、
// Storybook 内だけ軽量スタブへ差し替える（実アプリのビルドには影響しない）。
const vectorIconsMock = fileURLToPath(new URL('./mocks/vector-icons.tsx', import.meta.url));
// gesture-handler/reanimated は worklet を web で初期化できず落ちるためスタブへ。
const gestureHandlerMock = fileURLToPath(new URL('./mocks/gesture-handler.tsx', import.meta.url));
const reanimatedMock = fileURLToPath(new URL('./mocks/reanimated.tsx', import.meta.url));
const workletsMock = fileURLToPath(new URL('./mocks/worklets.tsx', import.meta.url));

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      // web 用に変換が必要な RN 系ライブラリ
      modulesToTranspile: [
        'react-native-reanimated',
        'react-native-gesture-handler',
        'react-native-worklets',
        'react-native-safe-area-context',
        '@gorhom/bottom-sheet',
        'react-native-calendars',
      ],
      // Storybook では reanimated/gesture-handler をスタブ化しているため、
      // worklet 変換（react-native-reanimated/plugin）は不要。入れると gesture
      // コールバックが worklet 化されて react-native-worklets を注入し web で落ちる。
    },
  },
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [],
  async viteFinal(viteConfig) {
    viteConfig.optimizeDeps = viteConfig.optimizeDeps ?? {};
    viteConfig.optimizeDeps.exclude = [
      ...(viteConfig.optimizeDeps.exclude ?? []),
      ...EXPO_MODULES,
    ];
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias as Record<string, string>),
      '@expo/vector-icons': vectorIconsMock,
      'react-native-gesture-handler': gestureHandlerMock,
      'react-native-reanimated': reanimatedMock,
      'react-native-worklets': workletsMock,
    };
    return viteConfig;
  },
};

export default config;
