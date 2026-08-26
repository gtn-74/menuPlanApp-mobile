import type { StorybookConfig } from '@storybook/react-native-web-vite';

// dev(rolldown)の依存事前バンドルが expo 系の型 re-export で落ちるため、
// それらを optimizeDeps から除外し、transpile 側で処理させる。
const EXPO_MODULES = ['expo-modules-core', 'expo-font', 'expo-asset', 'expo'];

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
        '@expo/vector-icons',
        '@gorhom/bottom-sheet',
        'react-native-calendars',
        ...EXPO_MODULES,
      ],
      pluginReactOptions: {
        babel: {
          plugins: ['react-native-reanimated/plugin'],
        },
      },
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
    return viteConfig;
  },
};

export default config;
