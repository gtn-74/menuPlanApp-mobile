import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  arrow: { padding: 6 },
  // ラベルが伸び縮みしても矢印が動かないよう、中央を flex で占める
  label: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: colors.text },
  resetButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  resetButtonDisabled: { borderColor: colors.border },
  resetLabel: { fontSize: 13, fontWeight: '600', color: colors.primary },
  resetLabelDisabled: { color: colors.textLight },
});
