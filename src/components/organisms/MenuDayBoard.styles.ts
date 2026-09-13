import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  container: { gap: 12 },
  summary: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
  },
  dateLabel: { fontSize: 18, fontWeight: '700', color: colors.text },
  countLabel: { fontSize: 13, color: colors.textSecondary },
  list: { gap: 8 },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 32,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
  },
  emptyText: { fontSize: 14, color: colors.textSecondary },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  detailButtonText: { fontSize: 14, fontWeight: '600', color: colors.primary },
});
