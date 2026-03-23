import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../theme/colors";
import { CategoryFilter } from "../../types";

interface HeaderProps {
  title?: string;
  selectedCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  onProfilePress?: () => void;
  onTodayPress?: () => void;
  currentMonth?: string;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}

const categoryLabels: Record<CategoryFilter, string> = {
  all: "すべて",
  menu: "献立",
  budget: "家計簿",
  todo: "予定",
};

export const Header: React.FC<HeaderProps> = ({
  title,
  selectedCategory,
  onCategoryChange,
  onProfilePress,
  onTodayPress,
  currentMonth,
  onPrevMonth,
  onNextMonth,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleCategorySelect = (category: CategoryFilter) => {
    onCategoryChange(category);
    setDropdownVisible(false);
  };

  const formatMonth = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  return (
    <View style={styles.container}>
      {currentMonth && (
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={onPrevMonth} style={styles.navButton}>
            <Ionicons name="chevron-back" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.monthText}>{formatMonth(currentMonth)}</Text>
          <TouchableOpacity onPress={onNextMonth} style={styles.navButton}>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.rightSection}>
        {onTodayPress && (
          <TouchableOpacity onPress={onTodayPress} style={styles.todayButton}>
            <Text style={styles.todayButtonText}>{new Date().getDate()}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => setDropdownVisible(true)}
          style={styles.dropdownButton}
        >
          <Text style={styles.dropdownButtonText}>
            {categoryLabels[selectedCategory]}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.text} />
        </TouchableOpacity>

        {onProfilePress && (
          <TouchableOpacity onPress={onProfilePress} style={styles.iconButton}>
            <Ionicons
              name="person-circle-outline"
              size={28}
              color={colors.text}
            />
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            {(Object.keys(categoryLabels) as CategoryFilter[]).map(
              (category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.dropdownItem,
                    selectedCategory === category &&
                      styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedCategory === category &&
                        styles.dropdownItemTextSelected,
                    ]}
                  >
                    {categoryLabels[category]}
                  </Text>
                  {selectedCategory === category && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ),
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  monthNavigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  navButton: {
    padding: 4,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    minWidth: 90,
    textAlign: "center",
  },
  todayButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  todayButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    gap: 4,
  },
  dropdownButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 100,
    paddingRight: 16,
  },
  dropdownMenu: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    fontWeight: "600",
    color: colors.primary,
  },
});
