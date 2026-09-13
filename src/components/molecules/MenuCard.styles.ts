import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    // 献立であることが一目で分かるよう、左端にカテゴリカラーの帯を出す
    borderLeftWidth: 3,
    borderLeftColor: colors.menu,
    borderRadius: 8,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 4,
  },
  cardCompact: {
    paddingVertical: 6,
    paddingLeft: 8,
    paddingRight: 2,
  },
  body: { flex: 1, gap: 2 },
  name: { fontSize: 15, fontWeight: '600', color: colors.text },
  nameCompact: { fontSize: 13, lineHeight: 17 },
  budget: { fontSize: 12, color: colors.budget, fontWeight: '600' },
  ingredients: { fontSize: 12, color: colors.textSecondary },
  deleteButton: { padding: 4 },
});
