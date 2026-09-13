import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/theme/colors';
import { styles } from './PeriodNavigator.styles';

interface PeriodNavigatorProps {
  /** 中央に出す期間ラベル（例: 「1月5日（月）」「1月4日 〜 1月10日」） */
  label: string;
  onPrev: () => void;
  onNext: () => void;
  /** 現在の期間へ戻すボタン。押せない（＝既に現在）ときは disabled で見た目も落とす */
  onReset: () => void;
  /** リセットボタンの文言（日別なら「今日」、週別なら「今週」） */
  resetLabel: string;
  resetDisabled?: boolean;
  testID?: string;
}

/**
 * molecule: 「← ラベル →」＋現在へ戻すボタン。
 * 日/週のどちらを何日ずらすかは呼び出し側が決めるので、このコンポーネントは期間の意味を知らない。
 */
export const PeriodNavigator: React.FC<PeriodNavigatorProps> = ({
  label,
  onPrev,
  onNext,
  onReset,
  resetLabel,
  resetDisabled = false,
  testID,
}) => (
  <View style={styles.container} testID={testID}>
    <TouchableOpacity
      testID={testID ? `${testID}-prev` : undefined}
      accessibilityRole="button"
      accessibilityLabel="前へ"
      style={styles.arrow}
      onPress={onPrev}
    >
      <Ionicons name="chevron-back" size={22} color={colors.primary} />
    </TouchableOpacity>

    <Text style={styles.label} numberOfLines={1}>
      {label}
    </Text>

    <TouchableOpacity
      testID={testID ? `${testID}-next` : undefined}
      accessibilityRole="button"
      accessibilityLabel="次へ"
      style={styles.arrow}
      onPress={onNext}
    >
      <Ionicons name="chevron-forward" size={22} color={colors.primary} />
    </TouchableOpacity>

    <TouchableOpacity
      testID={testID ? `${testID}-reset` : undefined}
      accessibilityRole="button"
      accessibilityState={{ disabled: resetDisabled }}
      disabled={resetDisabled}
      style={[styles.resetButton, resetDisabled && styles.resetButtonDisabled]}
      onPress={onReset}
    >
      <Text style={[styles.resetLabel, resetDisabled && styles.resetLabelDisabled]}>
        {resetLabel}
      </Text>
    </TouchableOpacity>
  </View>
);
