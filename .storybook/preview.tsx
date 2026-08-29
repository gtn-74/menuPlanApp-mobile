import type { Preview } from '@storybook/react-native-web-vite';
import { SafeAreaProvider, type Metrics } from 'react-native-safe-area-context';

// web の Storybook では SafeAreaView の計測（onLayout）が走らないため、
// initialMetrics を与えて即座にフレームを確定させる。これがないと
// SafeAreaView を使う template（例: CalendarLayout）が描画できずエラーになる。
const initialMetrics: Metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const preview: Preview = {
  decorators: [
    (Story) => (
      <SafeAreaProvider initialMetrics={initialMetrics}>
        <Story />
      </SafeAreaProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
