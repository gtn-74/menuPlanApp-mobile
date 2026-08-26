import type { StorybookConfig } from '@storybook/react-native-web-vite';

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
};

export default config;
