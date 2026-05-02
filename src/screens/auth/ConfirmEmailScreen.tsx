import React, { useState, useRef } from 'react';
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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../stores/authStore';
import { AuthStackParamList } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ConfirmEmail'>;

export const ConfirmEmailScreen = ({ navigation, route }: Props) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const confirmEmail = useAuthStore((state) => state.confirmEmail);
  const inputRef = useRef<TextInput>(null);

  const handleConfirm = async () => {
    if (code.length !== 6) {
      Alert.alert('エラー', '6桁の確認コードを入力してください');
      return;
    }
    setIsLoading(true);
    try {
      await confirmEmail(email, code);
      Alert.alert(
        'メール確認完了',
        'アカウントが有効化されました。ログインしてください。',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (e: any) {
      const msg = e?.response?.status === 400
        ? '確認コードが無効か期限切れです。再度お試しください'
        : '確認に失敗しました。しばらくしてから再試行してください';
      Alert.alert('エラー', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail" size={56} color={colors.primary} />
        </View>

        <Text style={styles.title}>メールをご確認ください</Text>
        <Text style={styles.subtitle}>
          <Text style={styles.emailText}>{email}</Text>
          {'\n'}に送信された6桁の確認コードを入力してください
        </Text>
        <Text style={styles.devHint}>（ローカル開発環境: コードは 123456）</Text>

        <TouchableOpacity
          style={styles.inputContainer}
          activeOpacity={1}
          onPress={() => inputRef.current?.focus()}
        >
          <TextInput
            ref={inputRef}
            style={styles.codeInput}
            value={code}
            onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            placeholderTextColor={colors.textLight}
            textAlign="center"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, (isLoading || code.length !== 6) && { opacity: 0.6 }]}
          onPress={handleConfirm}
          disabled={isLoading || code.length !== 6}
        >
          <Text style={styles.buttonText}>
            {isLoading ? '確認中...' : '確認する'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.backLinkText}>ログイン画面に戻る</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
  emailText: {
    fontWeight: '600',
    color: colors.text,
  },
  devHint: {
    fontSize: 12,
    color: colors.primary,
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    height: 64,
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 12,
    backgroundColor: colors.backgroundSecondary,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backLink: {
    padding: 8,
  },
  backLinkText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
