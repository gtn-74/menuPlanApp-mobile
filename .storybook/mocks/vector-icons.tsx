import React from 'react';
import { Text } from 'react-native';

/**
 * Storybook(web)用の @expo/vector-icons スタブ。
 *
 * 本物は expo-modules-core（TSソース配布・型onlyの re-export）を経由するため、
 * Vite dev では実行時に落ちる。Storybook ではアイコンの見た目は本質でないので、
 * expo-modules-core を通さない軽量プレースホルダに差し替える。
 * （実アプリのビルドには影響しない。Storybook 設定内の alias のみ）
 */
type IconProps = {
  name?: string;
  size?: number;
  color?: string;
};

const makeIcon = () =>
  function StubIcon({ size = 24, color = '#000', name }: IconProps) {
    return (
      <Text
        accessibilityLabel={name}
        style={{
          fontSize: size,
          lineHeight: size,
          width: size,
          height: size,
          color,
          textAlign: 'center',
        }}
      >
        ●
      </Text>
    );
  };

export const Ionicons = makeIcon();
export const MaterialIcons = makeIcon();
export const MaterialCommunityIcons = makeIcon();
export const FontAwesome = makeIcon();
export const Feather = makeIcon();

export default { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome, Feather };
