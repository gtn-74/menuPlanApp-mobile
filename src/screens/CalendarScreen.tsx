import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DateData } from "react-native-calendars";

import { CalendarView } from "../components/Calendar/CalendarView";
import { Header } from "../components/common/Header";
import { DayScheduleList } from "../components/DayScheduleList/DayScheduleList";
import { UserFilterButton } from "../components/molecules/UserFilterButton";
import { CalendarLayout } from "../components/templates/CalendarLayout";
import { buildMarkedDates } from "../features/calendar/buildMarkedDates";
import { formatDateJa } from "../utils/date";
import {
  mockBudgetItems,
  mockEvents,
  mockMenuItems,
  mockTodoItems,
  mockUsers,
} from "../mocks/data";
import { useFilterStore } from "../stores/filterStore";
import { colors } from "../theme/colors";
import { DayData, MarkedDates } from "../types";

export const CalendarScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().split("T")[0],
  );

  const handlePrevMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    setCurrentMonth(date.toISOString().split("T")[0]);
  };

  const handleNextMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + 1);
    setCurrentMonth(date.toISOString().split("T")[0]);
  };

  const handleTodayPress = () => {
    const today = new Date().toISOString().split("T")[0];
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

  // フィルター設定を読み込み
  React.useEffect(() => {
    loadFilters();
  }, []);

  // ユーザーフィルターを適用したデータ
  const filteredMenuItems = useMemo(
    () => mockMenuItems.filter((item) => visibleUserIds.includes(item.userId)),
    [visibleUserIds],
  );
  const filteredBudgetItems = useMemo(
    () =>
      mockBudgetItems.filter((item) => visibleUserIds.includes(item.userId)),
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
      menus: showMenu
        ? filteredMenuItems.filter((item) => item.date === selectedDate)
        : [],
      budgets: showBudget
        ? filteredBudgetItems.filter((item) => item.date === selectedDate)
        : [],
      events: filteredEvents.filter(
        (e) =>
          e.date === selectedDate &&
          ((e.type === "personal" && showPersonalEvents) ||
            (e.type === "family" && showFamilyEvents)),
      ),
      todos: showTodo
        ? filteredTodoItems.filter((item) => item.date === selectedDate)
        : [],
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
    if (selectedCategory !== "all" && selectedCategory !== "todo") return [];
    return filteredTodoItems.filter((todo) => todo.priority === "high");
  }, [selectedCategory, filteredTodoItems]);

  // ボトムシート
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["85%", "95%"], []);

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
          onProfilePress={() => navigation.navigate("Profile")}
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
              (e.type === "personal" && showPersonalEvents) ||
              (e.type === "family" && showFamilyEvents),
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
            <TouchableOpacity
              onPress={handleCloseSheet}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
            <DayScheduleList data={selectedDayData} hideHeader />
          </BottomSheetScrollView>
        </BottomSheet>
      }
    />
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomSheetIndicator: {
    backgroundColor: colors.border,
    width: 40,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  sheetContent: {
    paddingBottom: 40,
  },
});
