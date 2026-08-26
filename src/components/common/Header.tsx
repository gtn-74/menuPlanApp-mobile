import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/colors';
import type { CategoryFilter } from '../../types';
import { styles } from './Header.styles';

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
  all: 'すべて',
  menu: '献立',
  budget: '家計簿',
  todo: '予定',
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

        <TouchableOpacity onPress={() => setDropdownVisible(true)} style={styles.dropdownButton}>
          <Text style={styles.dropdownButtonText}>{categoryLabels[selectedCategory]}</Text>
          <Ionicons name="chevron-down" size={18} color={colors.text} />
        </TouchableOpacity>

        {onProfilePress && (
          <TouchableOpacity onPress={onProfilePress} style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={28} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setDropdownVisible(false)}>
          <View style={styles.dropdownMenu}>
            {(Object.keys(categoryLabels) as CategoryFilter[]).map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.dropdownItem,
                  selectedCategory === category && styles.dropdownItemSelected,
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedCategory === category && styles.dropdownItemTextSelected,
                  ]}
                >
                  {categoryLabels[category]}
                </Text>
                {selectedCategory === category && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
