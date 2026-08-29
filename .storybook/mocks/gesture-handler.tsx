import React from 'react';
import { View } from 'react-native';

/**
 * Storybook(web)用の react-native-gesture-handler スタブ。
 * 本物は reanimated/worklets を web で初期化しようとして落ちるため、
 * GestureDetector は children をそのまま描画、Gesture はチェーン可能な no-op にする。
 * （見た目・VRT は担保。スワイプ等のジェスチャ挙動は Storybook では無効）
 */
const chainable: any = new Proxy(() => chainable, {
  get: () => () => chainable,
});

export const Gesture: any = new Proxy(
  {},
  { get: () => () => chainable },
);

export const GestureDetector = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

export const GestureHandlerRootView = ({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: unknown;
}) => <View style={style as never}>{children}</View>;

export default {};
