import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/theme/colors';

interface UserFilterButtonProps {
  name: string;
  isVisible: boolean;
  onPress: () => void;
  testID?: string;
}

/**
 * molecule: アバター＋名前＋1つの操作(onPress)を持つフィルタボタン。
 * 状態は持たず「isVisible を見た目に写像」「押したら onPress」だけ = テストが容易。
 * （元は CalendarScreen の map 内にインラインで書かれていた）
 */
export const UserFilterButton: React.FC<UserFilterButtonProps> = ({
  name,
  isVisible,
  onPress,
  testID,
}) => (
  <TouchableOpacity
    testID={testID}
    accessibilityRole="button"
    accessibilityState={{ selected: isVisible }}
    style={[styles.button, !isVisible && styles.buttonInactive]}
    onPress={onPress}
  >
    <View style={[styles.avatar, !isVisible && styles.avatarInactive]}>
      <Ionicons
        name="person"
        size={28}
        color={isVisible ? colors.background : colors.textLight}
      />
    </View>
    <Text style={[styles.name, !isVisible && styles.nameInactive]}>{name}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
