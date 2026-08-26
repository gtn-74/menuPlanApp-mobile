import React from 'react';
import { View } from 'react-native';
import { styles } from './Dot.styles';

interface DotProps {
  color: string;
  size?: number;
  /** テストや支援技術から参照するための識別子 */
  testID?: string;
}

/**
 * atom: 色付きの丸。カレンダーの予定ドット等に使う純粋な表示部品。
 * ロジックを持たず props をそのまま見た目に写像するだけ = テストが容易。
 */
export const Dot: React.FC<DotProps> = ({ color, size = 6, testID }) => (
  <View
    testID={testID}
    style={[
      styles.dot,
      { backgroundColor: color, width: size, height: size, borderRadius: size / 2 },
    ]}
  />
);
