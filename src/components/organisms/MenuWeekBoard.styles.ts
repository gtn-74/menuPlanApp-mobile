import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

/**
 * 1列の幅。スマホ幅（〜400px）を7等分すると料理名が読めないため、
 * 固定幅＋横スクロールにして「2.5列くらいが常に見えている」状態を狙う。
 */
export const WEEK_COLUMN_WIDTH = 150;

export const styles = StyleSheet.create({
  // alignItems: stretch で全列の高さを最も高い列に揃え、表らしく見せる
  row: { flexDirection: 'row', alignItems: 'stretch', gap: 8, paddingRight: 8 },
  column: {
    width: WEEK_COLUMN_WIDTH,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  columnToday: { borderColor: colors.primary },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerToday: { backgroundColor: colors.today },
  weekday: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  monthDay: { fontSize: 13, fontWeight: '600', color: colors.text },
  sunday: { color: colors.error },
  saturday: { color: colors.info },
  todayText: { color: colors.primaryDark },
  cards: { gap: 6, padding: 8 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primaryLight,
  },
  addButtonText: { fontSize: 13, fontWeight: '600', color: colors.primary },
});
