import type React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './MenuViewModeTabs.styles';

/** 献立画面の表示単位。日別＝1日を深く、週別＝7日を見渡す。 */
export type MenuViewMode = 'day' | 'week';

const TABS: Array<{ mode: MenuViewMode; label: string }> = [
  { mode: 'day', label: '日別' },
  { mode: 'week', label: '週別' },
];

interface MenuViewModeTabsProps {
  value: MenuViewMode;
  onChange: (mode: MenuViewMode) => void;
  testID?: string;
}

/**
 * molecule: 日別/週別のセグメント切り替え。
 * 状態は持たず「value を見た目に写像」「押したら onChange」だけ。
 */
export const MenuViewModeTabs: React.FC<MenuViewModeTabsProps> = ({ value, onChange, testID }) => (
  <View style={styles.container} testID={testID}>
    {TABS.map(({ mode, label }) => {
      const selected = value === mode;
      return (
        <TouchableOpacity
          key={mode}
          testID={testID ? `${testID}-${mode}` : undefined}
          accessibilityRole="tab"
          accessibilityState={{ selected }}
          style={[styles.tab, selected && styles.tabSelected]}
          onPress={() => onChange(mode)}
        >
          <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);
