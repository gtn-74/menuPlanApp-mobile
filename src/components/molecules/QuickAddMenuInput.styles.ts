import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  container: { gap: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.background,
    paddingLeft: 10,
    paddingRight: 4,
    paddingVertical: 4,
  },
  rowCompact: { paddingLeft: 8, borderRadius: 8 },
  rowError: { borderColor: colors.error },
  input: { flex: 1, fontSize: 14, color: colors.text, paddingVertical: 6 },
  inputCompact: { fontSize: 13, paddingVertical: 4 },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  errorText: { fontSize: 12, color: colors.error },
});
