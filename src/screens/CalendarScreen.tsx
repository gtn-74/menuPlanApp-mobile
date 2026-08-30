import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { DateData } from 'react-native-calendars';
import { CalendarView } from '../components/Calendar/CalendarView';
import { Header } from '../components/common/Header';
import { DayScheduleList } from '../components/DayScheduleList/DayScheduleList';
import { UserFilterButton } from '../components/molecules/UserFilterButton';
import { CalendarLayout } from '../components/templates/CalendarLayout';
import { buildMarkedDates } from '../features/calendar/buildMarkedDates';
import { mockBudgetItems, mockEvents, mockTodoItems, mockUsers } from '../mocks/data';
import { useFilterStore } from '../stores/filterStore';
import { useMenuStore } from '../stores/menuStore';
import { colors } from '../theme/colors';
import type { DayData, MainStackParamList, MainTabParamList, MarkedDates } from '../types';
import { formatDateJa } from '../utils/date';
import { styles } from './CalendarScreen.styles';

// カレンダーはタブ配下だが、Profile は親のメインスタックにあるため両者を合成する
type CalendarScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Calendar'>,
  NativeStackNavigationProp<MainStackParamList>
>;

export const CalendarScreen: React.FC = () => {
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().split('T')[0]);

  const handlePrevMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    setCurrentMonth(date.toISOString().split('T')[0]);
  };

  const handleNextMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + 1);
    setCurrentMonth(date.toISOString().split('T')[0]);
  };

  const handleTodayPress = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setCurrentMonth(today);
  };

  const {
    showMenu,
    showBudget,
    showPersonalEvents,
    showFamilyEvents,
    showTodo,
    selectedCategory,
    setCategory,
    loadFilters,
    visibleUserIds,
    toggleUserVisibility,
    quickFilterUserIds,
  } = useFilterStore();

  // 献立は menuStore（＝AsyncStorage 永続化）から取得（local-first）
  const menuItems = useMenuStore((s) => s.items);
  const loadMenus = useMenuStore((s) => s.load);

  // フィルター設定・献立を読み込み
  React.useEffect(() => {
    loadFilters();
    loadMenus();
  }, []);

  // ユーザーフィルターを適用したデータ
  const filteredMenuItems = useMemo(
    () => menuItems.filter((item) => visibleUserIds.includes(item.userId)),
    [menuItems, visibleUserIds],
  );
  const filteredBudgetItems = useMemo(
    () => mockBudgetItems.filter((item) => visibleUserIds.includes(item.userId)),
    [visibleUserIds],
  );
  const filteredEvents = useMemo(
    () => mockEvents.filter((item) => visibleUserIds.includes(item.userId)),
    [visibleUserIds],
  );
  const filteredTodoItems = useMemo(
    () =>
      mockTodoItems.filter((item) => {
        // 担当者がいない場合は全員に表示、いる場合は担当者でフィルタ
        if (!item.assignedTo) return true;
        return visibleUserIds.includes(item.assignedTo);
      }),
    [visibleUserIds],
  );

  // マーク済み日付を生成（ロジックは features/calendar の純関数へ抽出済み）
  const markedDates: MarkedDates = useMemo(() => {
    return buildMarkedDates({
      menus: filteredMenuItems,
      budgets: filteredBudgetItems,
      events: filteredEvents,
      todos: filteredTodoItems,
      flags: {
        showMenu,
        showBudget,
        showPersonalEvents,
        showFamilyEvents,
        showTodo,
      },
      selectedDate,
    });
  }, [
    showMenu,
    showBudget,
    showPersonalEvents,
    showFamilyEvents,
    showTodo,
    selectedDate,
    filteredMenuItems,
    filteredBudgetItems,
    filteredEvents,
    filteredTodoItems,
  ]);

  // 選択日のデータ（リスト表示用：全てのTodoを表示）
  const selectedDayData: DayData = useMemo(() => {
    return {
      date: selectedDate,
      menus: showMenu ? filteredMenuItems.filter((item) => item.date === selectedDate) : [],
      budgets: showBudget ? filteredBudgetItems.filter((item) => item.date === selectedDate) : [],
      events: filteredEvents.filter(
        (e) =>
          e.date === selectedDate &&
          ((e.type === 'personal' && showPersonalEvents) ||
            (e.type === 'family' && showFamilyEvents)),
      ),
      todos: showTodo ? filteredTodoItems.filter((item) => item.date === selectedDate) : [],
    };
  }, [
    selectedDate,
    showMenu,
    showBudget,
    showPersonalEvents,
    showFamilyEvents,
    showTodo,
    filteredMenuItems,
    filteredBudgetItems,
    filteredEvents,
    filteredTodoItems,
  ]);

  // カレンダー表示用：「すべて」または「予定」カテゴリ時に高優先度Todoを表示
  const calendarTodoItems = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'todo') return [];
    return filteredTodoItems.filter((todo) => todo.priority === 'high');
  }, [selectedCategory, filteredTodoItems]);

  // ボトムシート
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['85%', '95%'], []);

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleCloseSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return (
    <CalendarLayout
      header={
        <Header
          selectedCategory={selectedCategory}
          onCategoryChange={setCategory}
          onProfilePress={() => navigation.navigate('Profile')}
          onTodayPress={handleTodayPress}
          currentMonth={currentMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      }
      calendar={
        <CalendarView
          markedDates={markedDates}
          selectedDate={selectedDate}
          currentMonth={currentMonth}
          onDayPress={handleDayPress}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          menuItems={showMenu ? filteredMenuItems : []}
          events={filteredEvents.filter(
            (e) =>
              (e.type === 'personal' && showPersonalEvents) ||
              (e.type === 'family' && showFamilyEvents),
          )}
          budgetItems={showBudget ? filteredBudgetItems : []}
          todoItems={calendarTodoItems}
          hideHeader
        />
      }
      userFilter={mockUsers
        .filter((user) => quickFilterUserIds.includes(user.id))
        .slice(0, 5)
        .map((user) => (
          <UserFilterButton
            key={user.id}
            name={user.name}
            isVisible={visibleUserIds.includes(user.id)}
            onPress={() => toggleUserVisibility(user.id)}
          />
        ))}
      sheet={
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.bottomSheetIndicator}
        >
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{formatDateJa(selectedDate)}</Text>
            <View style={styles.sheetHeaderActions}>
              <TouchableOpacity
                onPress={() => {
                  handleCloseSheet();
                  navigation.navigate('MenuAdd', { date: selectedDate });
                }}
                style={styles.addMenuButton}
                accessibilityRole="button"
              >
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={styles.addMenuButtonText}>献立</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCloseSheet} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
            <DayScheduleList data={selectedDayData} hideHeader />
          </BottomSheetScrollView>
        </BottomSheet>
      }
    />
  );
};
