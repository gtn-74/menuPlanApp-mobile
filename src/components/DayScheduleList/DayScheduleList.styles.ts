import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textLight,
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  indicator: {
    width: 4,
    height: '100%',
    minHeight: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  itemSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemType: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  itemBudget: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
    marginTop: 4,
  },
  todoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  todoTitle: {
    flex: 1,
  },
  todoCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  todoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 28,
    gap: 10,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
  },
  assigneeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  assigneeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
