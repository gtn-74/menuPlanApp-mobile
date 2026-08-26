import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  button: { alignItems: 'center', gap: 4 },
  buttonInactive: { opacity: 0.6 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInactive: { backgroundColor: colors.border },
  name: { fontSize: 13, color: colors.text, fontWeight: '500' },
  nameInactive: { color: colors.textLight },
});
