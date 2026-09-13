import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 8,
  },
  tabSelected: { backgroundColor: colors.primary },
  label: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  labelSelected: { color: colors.background },
});
