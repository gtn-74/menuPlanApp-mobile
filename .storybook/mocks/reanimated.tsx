/**
 * Storybook(web)用の react-native-reanimated スタブ（最小）。
 * worklet 初期化を避けるため、CalendarView が使う runOnJS だけ通常関数として提供する。
 */
export const runOnJS =
  (fn: (...args: unknown[]) => unknown) =>
  (...args: unknown[]) =>
    fn(...args);

export default {};
