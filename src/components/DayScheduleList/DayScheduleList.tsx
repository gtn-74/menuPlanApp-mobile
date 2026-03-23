import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { DayData } from '../../types';
import { colors } from '../../theme/colors';
import { getUserName } from '../../mocks/data';

interface DayScheduleListProps {
  data: DayData;
  hideHeader?: boolean;
}

const priorityLabels = {
  high: '高',
  medium: '中',
  low: '低',
};

const priorityColors = {
  high: '#F44336',
  medium: '#FF9800',
  low: '#9E9E9E',
};

export const DayScheduleList: React.FC<DayScheduleListProps> = ({ data, hideHeader = false }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${month}月${day}日（${weekday}）`;
  };

  const hasData = data.events.length > 0 || data.menus.length > 0 || data.todos.length > 0;

  return (
    <View style={styles.container}>
      {!hideHeader && <Text style={styles.dateHeader}>{formatDate(data.date)}</Text>}

      <View style={styles.listContainer}>
        {!hasData && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={32} color={colors.textLight} />
            <Text style={styles.emptyText}>予定・献立はありません</Text>
          </View>
        )}

        {/* 予定セクション */}
        {data.events.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time-outline" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>予定</Text>
            </View>
            {data.events.map((event) => (
              <View key={event.id} style={styles.listItem}>
                <View style={[
                  styles.indicator,
                  { backgroundColor: event.type === 'family' ? colors.dots.familyEvent : colors.dots.personalEvent }
                ]} />
                <View style={styles.itemContent}>
                  <Text style={styles.itemTime}>{event.time}</Text>
                  <Text style={styles.itemTitle}>{event.title}</Text>
                  <Text style={styles.itemType}>
                    {event.type === 'family' ? '家族' : '個人'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 献立セクション */}
        {data.menus.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="restaurant-outline" size={18} color={colors.dots.menu} />
              <Text style={styles.sectionTitle}>献立</Text>
            </View>
            {data.menus.map((menu) => (
              <View key={menu.id} style={styles.listItem}>
                <View style={[styles.indicator, { backgroundColor: colors.dots.menu }]} />
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{menu.name}</Text>
                  <Text style={styles.itemSubtitle}>
                    {menu.ingredients.slice(0, 3).join('、')}
                    {menu.ingredients.length > 3 && '...'}
                  </Text>
                  <Text style={styles.itemBudget}>¥{menu.budget.toLocaleString()}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Todoセクション */}
        {data.todos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkbox-outline" size={18} color={colors.dots.todo} />
              <Text style={styles.sectionTitle}>Todo</Text>
            </View>
            {data.todos.map((todo) => (
              <View key={todo.id} style={styles.listItem}>
                <View style={[styles.indicator, { backgroundColor: colors.dots.todo }]} />
                <View style={styles.itemContent}>
                  <View style={styles.todoHeader}>
                    <Ionicons
                      name={todo.completed ? 'checkbox' : 'square-outline'}
                      size={20}
                      color={todo.completed ? colors.success : colors.textSecondary}
                    />
                    <Text style={[
                      styles.itemTitle,
                      styles.todoTitle,
                      todo.completed && styles.todoCompleted,
                    ]}>
                      {todo.title}
                    </Text>
                  </View>
                  <View style={styles.todoMeta}>
                    <View style={[styles.priorityBadge, { backgroundColor: priorityColors[todo.priority] }]}>
                      <Text style={styles.priorityText}>{priorityLabels[todo.priority]}</Text>
                    </View>
                    <View style={styles.assigneeInfo}>
                      <Ionicons name="person" size={12} color={colors.textSecondary} />
                      <Text style={styles.assigneeText}>
                        {todo.assignedTo ? getUserName(todo.assignedTo) : '未割当'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
