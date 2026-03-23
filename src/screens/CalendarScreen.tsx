import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DateData } from "react-native-calendars";

import { CalendarView } from "../components/Calendar/CalendarView";
import { Header } from "../components/common/Header";
import { DayScheduleList } from "../components/DayScheduleList/DayScheduleList";
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

  // マーク済み日付を生成
  const markedDates: MarkedDates = useMemo(() => {
    const marked: MarkedDates = {};

    // すべてのデータから日付を収集
    const allDates = new Set<string>();
    if (showMenu) filteredMenuItems.forEach((item) => allDates.add(item.date));
    if (showBudget)
      filteredBudgetItems.forEach((item) => allDates.add(item.date));
    if (showPersonalEvents || showFamilyEvents) {
      filteredEvents.forEach((event) => {
        if (
          (event.type === "personal" && showPersonalEvents) ||
          (event.type === "family" && showFamilyEvents)
        ) {
          allDates.add(event.date);
        }
      });
    }
    if (showTodo) filteredTodoItems.forEach((item) => allDates.add(item.date));

    // 各日付にドットを追加
    allDates.forEach((date) => {
      const dots = [];

      if (showMenu && filteredMenuItems.some((item) => item.date === date)) {
        dots.push({ key: "menu", color: colors.dots.menu });
      }
      if (
        showBudget &&
        filteredBudgetItems.some((item) => item.date === date)
      ) {
        dots.push({ key: "budget", color: colors.dots.budget });
      }
      if (
        showPersonalEvents &&
        filteredEvents.some((e) => e.date === date && e.type === "personal")
      ) {
        dots.push({ key: "personalEvent", color: colors.dots.personalEvent });
      }
      if (
        showFamilyEvents &&
        filteredEvents.some((e) => e.date === date && e.type === "family")
      ) {
        dots.push({ key: "familyEvent", color: colors.dots.familyEvent });
      }
      if (showTodo && filteredTodoItems.some((item) => item.date === date)) {
        dots.push({ key: "todo", color: colors.dots.todo });
      }

      if (dots.length > 0) {
        marked[date] = {
          dots,
          selected: date === selectedDate,
          selectedColor: colors.selectedDay,
        };
      }
    });

    // 選択日をマーク
    if (!marked[selectedDate]) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: colors.selectedDay,
      };
    }

    return marked;
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

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const weekday = weekdays[date.getDay()];
    return `${month}月${day}日（${weekday}）`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        selectedCategory={selectedCategory}
        onCategoryChange={setCategory}
        onProfilePress={() => navigation.navigate("Profile")}
        onTodayPress={handleTodayPress}
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      <View style={styles.calendarContainer}>
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
      </View>

      <View style={styles.userFilterContainer}>
        {mockUsers
          .filter((user) => quickFilterUserIds.includes(user.id))
          .slice(0, 5)
          .map((user) => {
            const isVisible = visibleUserIds.includes(user.id);
            return (
              <TouchableOpacity
                key={user.id}
                style={[
                  styles.userFilterButton,
                  !isVisible && styles.userFilterButtonInactive,
                ]}
                onPress={() => toggleUserVisibility(user.id)}
              >
                <View
                  style={[
                    styles.userFilterAvatar,
                    !isVisible && styles.userFilterAvatarInactive,
                  ]}
                >
                  <Ionicons
                    name="person"
                    size={28}
                    color={isVisible ? colors.background : colors.textLight}
                  />
                </View>
                <Text
                  style={[
                    styles.userFilterName,
                    !isVisible && styles.userFilterNameInactive,
                  ]}
                >
                  {user.name}
                </Text>
              </TouchableOpacity>
            );
          })}
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>
            {formatDateHeader(selectedDate)}
          </Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  calendarContainer: {
    flex: 1,
  },
  userFilterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 20,
  },
  userFilterButton: {
    alignItems: "center",
    gap: 4,
  },
  userFilterButtonInactive: {
    opacity: 0.6,
  },
  userFilterAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  userFilterAvatarInactive: {
    backgroundColor: colors.border,
  },
  userFilterName: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "500",
  },
  userFilterNameInactive: {
    color: colors.textLight,
  },
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
