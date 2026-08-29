/**
 * Storybook(web)用の react-native-worklets スタブ（最小）。
 * 本物は web で worklet ランタイム初期化に失敗する。CalendarView が使う
 * scheduleOnRN だけ通常関数として提供する（gesture 無効なので実行はされない）。
 */
export const scheduleOnRN =
  (fn: (...args: unknown[]) => unknown) =>
  (...args: unknown[]) =>
    fn(...args);

export default {};
