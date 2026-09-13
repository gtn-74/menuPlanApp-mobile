import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { menuQuickAddSchema } from '@/schemas/menu';
import { colors } from '@/theme/colors';
import { styles } from './QuickAddMenuInput.styles';

interface QuickAddMenuInputProps {
  /** 検証済み（trim 済み）の料理名を受け取る。保存は呼び出し側の責務 */
  onSubmit: (name: string) => void;
  placeholder?: string;
  /** 週別ビューの狭い列で使う圧縮表示 */
  compact?: boolean;
  autoFocus?: boolean;
  testID?: string;
}

/**
 * molecule: 料理名だけで1件登録するインライン入力。
 * 入力中の文字列という「その場限りの UI 状態」だけを内部に持ち、
 * 検証を通った値を onSubmit で外へ渡す（保存先を知らないので日別/週別の双方で使える）。
 */
export const QuickAddMenuInput: React.FC<QuickAddMenuInputProps> = ({
  onSubmit,
  placeholder = '料理名を入力して追加',
  compact = false,
  autoFocus = false,
  testID,
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const result = menuQuickAddSchema.safeParse({ name });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? '料理名を入力してください');
      return;
    }
    onSubmit(result.data.name);
    // 連続で登録できるよう入力欄を空に戻す（フォーカスは維持したまま）
    setName('');
    setError(null);
  };

  const handleChange = (value: string) => {
    setName(value);
    if (error) setError(null);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.row, compact && styles.rowCompact, !!error && styles.rowError]}>
        <TextInput
          testID={testID}
          style={[styles.input, compact && styles.inputCompact]}
          value={name}
          onChangeText={handleChange}
          onSubmitEditing={handleSubmit}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          autoFocus={autoFocus}
          returnKeyType="done"
          // 送信してもフォーカスを外さない＝続けて次の献立を打てる（旧 blurOnSubmit={false}）
          submitBehavior="submit"
          accessibilityLabel={placeholder}
        />
        <TouchableOpacity
          testID={testID ? `${testID}-submit` : undefined}
          accessibilityRole="button"
          accessibilityLabel="献立を追加"
          style={styles.submitButton}
          onPress={handleSubmit}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="add" size={compact ? 16 : 20} color={colors.background} />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
