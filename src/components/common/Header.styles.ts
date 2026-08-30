import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconButton: {
    padding: 4,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    padding: 4,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    minWidth: 90,
    textAlign: 'center',
  },
  todayButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  todayButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    gap: 4,
  },
  dropdownButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 16,
  },
  dropdownMenu: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemSelected: {
    backgroundColor: colors.backgroundSecondary,
  },
  dropdownItemText: {
    fontSize: 15,
    color: colors.text,
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
});
