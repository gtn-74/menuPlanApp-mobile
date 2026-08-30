import type React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Calendar, type CalendarProps, type DateData, LocaleConfig } from 'react-native-calendars';

type DayState = 'selected' | 'disabled' | 'inactive' | 'today' | '';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { getUserName } from '../../mocks/data';
import { colors } from '../../theme/colors';
import type { BudgetItem, Event, MarkedDates, MenuItem, TodoItem } from '../../types';
import { MAX_LABELS, styles } from './CalendarView.styles';

// 日本語ロケール設定
LocaleConfig.locales['ja'] = {
  monthNames: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
  monthNamesShort: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
  dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
  today: '今日',
};
LocaleConfig.defaultLocale = 'ja';

interface DayLabel {
  text: string;
  color: string;
}

interface CalendarViewProps {
  markedDates: MarkedDates;
  selectedDate: string;
  currentMonth?: string;
  onDayPress: (day: DateData) => void;
  onMonthChange?: (month: DateData) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  menuItems?: MenuItem[];
  events?: Event[];
  budgetItems?: BudgetItem[];
  todoItems?: TodoItem[];
  hideHeader?: boolean;
}

// dayComponent に渡される marking の型をライブラリの公開型から導出する
type DayComponentProps = React.ComponentProps<NonNullable<CalendarProps['dayComponent']>>;

interface CustomDayProps {
  date?: DateData;
  state?: DayState;
  marking?: DayComponentProps['marking'];
  onPress?: (date: DateData) => void;
  labels?: DayLabel[];
  isSelected?: boolean;
}

const CustomDay: React.FC<CustomDayProps> = ({
  date,
  state,
  marking,
  onPress,
  labels = [],
  isSelected,
}) => {
  const isDisabled = state === 'disabled';
  const isToday = state === 'today';
  const hasLabels = labels.length > 0;

  const handlePress = () => {
    if (date && onPress) {
      onPress(date);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      style={[styles.dayContainer, hasLabels && styles.dayContainerWithLabels]}
    >
      <View
        style={[
          styles.dayNumber,
          isSelected && styles.dayNumberSelected,
          isToday && !isSelected && styles.dayNumberToday,
        ]}
      >
        <Text
          style={[
            styles.dayText,
            isDisabled && styles.dayTextDisabled,
            isToday && !isSelected && styles.dayTextToday,
            isSelected && styles.dayTextSelected,
          ]}
        >
          {date?.day}
        </Text>
      </View>

      {hasLabels && (
        <View style={styles.labelsContainer}>
          {labels.slice(0, MAX_LABELS).map((label, index) => (
            <View key={index} style={[styles.label, { backgroundColor: label.color }]}>
              <Text style={styles.labelText} numberOfLines={1}>
                {label.text}
              </Text>
            </View>
          ))}
          {labels.length > MAX_LABELS && (
            <Text style={styles.moreText}>+{labels.length - MAX_LABELS}</Text>
          )}
        </View>
      )}

      {!hasLabels && marking?.dots && marking.dots.length > 0 && (
        <View style={styles.dotsContainer}>
          {marking.dots.slice(0, 4).map((dot, index) => (
            <View key={dot.key || index} style={[styles.dot, { backgroundColor: dot.color }]} />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  markedDates,
  selectedDate,
  currentMonth,
  onDayPress,
  onMonthChange,
  onPrevMonth,
  onNextMonth,
  menuItems = [],
  events = [],
  budgetItems = [],
  todoItems = [],
  hideHeader = false,
}) => {
  // 横スワイプで月を移動
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((event) => {
      if (event.translationX > 50 && onPrevMonth) {
        scheduleOnRN(onPrevMonth);
      } else if (event.translationX < -50 && onNextMonth) {
        scheduleOnRN(onNextMonth);
      }
    });

  // 日付ごとのラベルをマップ
  const labelsByDate: Record<string, DayLabel[]> = {};

  // 献立を追加
  menuItems.forEach((item) => {
    if (!labelsByDate[item.date]) labelsByDate[item.date] = [];
    labelsByDate[item.date].push({
      text: item.name,
      color: colors.dots.menu,
    });
  });

  // 予定を追加
  events.forEach((event) => {
    if (!labelsByDate[event.date]) labelsByDate[event.date] = [];
    const userName = getUserName(event.userId);
    const displayText = event.type === 'personal' ? `${userName}: ${event.title}` : event.title;
    labelsByDate[event.date].push({
      text: displayText,
      color: event.type === 'family' ? colors.dots.familyEvent : colors.dots.personalEvent,
    });
  });

  // 家計簿を追加
  budgetItems.forEach((item) => {
    if (!labelsByDate[item.date]) labelsByDate[item.date] = [];
    labelsByDate[item.date].push({
      text: `¥${Math.abs(item.amount).toLocaleString()}`,
      color: colors.dots.budget,
    });
  });

  // Todo（高優先度）を追加
  todoItems.forEach((item) => {
    if (!labelsByDate[item.date]) labelsByDate[item.date] = [];
    const assignedName = item.assignedTo ? getUserName(item.assignedTo) : '';
    const displayText = assignedName ? `${assignedName}: ${item.title}` : item.title;
    labelsByDate[item.date].push({
      text: displayText,
      color: colors.dots.todo,
    });
  });

  // データ変更時に再描画するためのキー
  const dataKey = `${currentMonth}-${menuItems.length}-${events.length}-${budgetItems.length}-${todoItems.length}`;

  // 現在の月の週数を計算
  const getWeekNumbersForMonth = (monthString: string) => {
    const date = new Date(monthString);
    const year = date.getFullYear();
    const month = date.getMonth();

    // 月の最初の日
    const firstDay = new Date(year, month, 1);
    // 月の最後の日
    const lastDay = new Date(year, month + 1, 0);

    // カレンダーに表示される最初の日（前月の日曜日から）
    const calendarStart = new Date(firstDay);
    calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay());

    // カレンダーに表示される最後の日（次月の土曜日まで）
    const calendarEnd = new Date(lastDay);
    if (calendarEnd.getDay() !== 6) {
      calendarEnd.setDate(calendarEnd.getDate() + (6 - calendarEnd.getDay()));
    }

    const weekNumbers: number[] = [];
    const current = new Date(calendarStart);

    while (current <= calendarEnd) {
      // ISO週番号を計算
      const tempDate = new Date(current.getTime());
      tempDate.setHours(0, 0, 0, 0);
      tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
      const week1 = new Date(tempDate.getFullYear(), 0, 4);
      const weekNum =
        1 +
        Math.round(
          ((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7,
        );
      weekNumbers.push(weekNum);
      current.setDate(current.getDate() + 7);
    }

    return weekNumbers;
  };

  const weekNumbers = getWeekNumbersForMonth(currentMonth || selectedDate);

  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={styles.calendarWrapper}>
        {/* カスタム週数列 */}
        <View style={styles.weekNumberColumn}>
          <View style={styles.weekNumberHeader} />
          {weekNumbers.map((weekNum, index) => (
            <View key={index} style={styles.weekNumberCell}>
              <Text style={styles.weekNumberText}>{weekNum}</Text>
            </View>
          ))}
        </View>

        {/* カレンダー本体 */}
        <View style={styles.calendarContainer}>
          <Calendar
            key={dataKey}
            current={currentMonth || selectedDate}
            markedDates={markedDates}
            onDayPress={onDayPress}
            onMonthChange={onMonthChange}
            hideArrows={hideHeader}
            renderHeader={hideHeader ? () => null : undefined}
            style={styles.calendar}
            dayComponent={({ date, state, marking }) => (
              <CustomDay
                date={date}
                state={state}
                marking={marking}
                onPress={onDayPress}
                labels={date ? labelsByDate[date.dateString] : undefined}
                isSelected={date?.dateString === selectedDate}
              />
            )}
            theme={{
              backgroundColor: colors.background,
              calendarBackground: colors.background,
              textSectionTitleColor: colors.textSecondary,
              arrowColor: colors.primary,
              monthTextColor: colors.text,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
              weekVerticalMargin: 0,
            }}
          />
        </View>
      </View>
    </GestureDetector>
  );
};
