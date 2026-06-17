import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useFamilyGroupStore } from '../stores/familyGroupStore';

export const GroupSetupScreen = () => {
  const [groupName, setGroupName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { createGroup, isLoading } = useFamilyGroupStore();

  const handleCreate = async () => {
    const trimmed = groupName.trim();
    if (!trimmed || trimmed.length > 50) return;
    setErrorMsg('');
    try {
      await createGroup(trimmed);
      // 成功時: authStore の user.familyGroupId が更新 → App.tsx が MainNavigator へ自動遷移
    } catch (e: any) {
      const msg = e?.response?.status === 409
        ? '既にグループに参加しています'
        : 'グループの作成に失敗しました。しばらくしてから再試行してください';
      setErrorMsg(msg);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <View style={styles.iconContainer}>
          <Ionicons name="home" size={48} color={colors.primary} />
        </View>

        <Text style={styles.title}>ファミリーグループを作成</Text>
        <Text style={styles.subtitle}>
          グループ名を入力してください。{'\n'}後からいつでも変更できます。
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>グループ名</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="people-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="例: 田中家"
              placeholderTextColor={colors.textLight}
              value={groupName}
              onChangeText={setGroupName}
              maxLength={50}
              autoFocus
            />
          </View>
          <Text style={styles.charCount}>{groupName.trim().length} / 50</Text>
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <TouchableOpacity
          style={[styles.button, (isLoading || !groupName.trim()) && { opacity: 0.6 }]}
          onPress={handleCreate}
          disabled={isLoading || !groupName.trim()}
        >
          <Text style={styles.buttonText}>
            {isLoading ? '作成中...' : 'グループを作成する'}
          </Text>
        </TouchableOpacity>
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
    backgroundColor: '#FFF3E0',
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
    marginBottom: 4,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 18,
    color: colors.text,
  },
  charCount: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'right',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 12,
  },
});
