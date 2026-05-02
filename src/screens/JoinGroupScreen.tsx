import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useFamilyGroupStore } from '../stores/familyGroupStore';

export const JoinGroupScreen = () => {
  const [token, setToken] = useState('');
  const { joinGroup, isLoading } = useFamilyGroupStore();

  const handleJoin = async () => {
    const trimmed = token.trim();
    if (!trimmed) {
      Alert.alert('エラー', '招待トークンを入力してください');
      return;
    }
    try {
      await joinGroup(trimmed);
      // 成功時は authStore の user.familyGroupId が更新され App.tsx が自動遷移
    } catch (e: any) {
      const status = e?.response?.status;
      const msg =
        status === 400 ? '招待トークンが無効か期限切れです' :
        status === 409 ? '既にグループに参加しています' :
        'グループへの参加に失敗しました。しばらくしてから再試行してください';
      Alert.alert('エラー', msg);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <View style={styles.iconContainer}>
          <Ionicons name="enter" size={48} color={colors.success} />
        </View>

        <Text style={styles.title}>グループに参加する</Text>
        <Text style={styles.subtitle}>
          家族から受け取った招待トークンを{'\n'}入力して参加してください
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>招待トークン</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="key-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="招待トークンを貼り付け"
              placeholderTextColor={colors.textLight}
              value={token}
              onChangeText={setToken}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />
            {token.length > 0 && (
              <TouchableOpacity onPress={() => setToken('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={18} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, (isLoading || !token.trim()) && { opacity: 0.6 }]}
          onPress={handleJoin}
          disabled={isLoading || !token.trim()}
        >
          <Text style={styles.buttonText}>
            {isLoading ? '参加中...' : 'グループに参加する'}
          </Text>
        </TouchableOpacity>

        <View style={styles.hint}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.hintText}>
            招待トークンは家族がグループ管理画面から発行できます
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 15,
    color: colors.text,
  },
  clearButton: {
    padding: 4,
  },
  button: {
    backgroundColor: colors.success,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    padding: 12,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
