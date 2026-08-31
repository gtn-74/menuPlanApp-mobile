import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { firstFieldErrors } from '@/schemas/auth';
import { menuFormSchema } from '@/schemas/menu';
import { useMenuStore } from '@/stores/menuStore';
import { colors } from '@/theme/colors';
import type { MainStackParamList } from '@/types';
import { formatDateJa } from '@/utils/date';
import { styles } from './MenuAddScreen.styles';

type Props = NativeStackScreenProps<MainStackParamList, 'MenuAdd'>;

/**
 * page: 献立の追加フォーム。日付は route.params で受け取り、保存は menuStore（→repository）経由。
 * バリデーションは zod（menuFormSchema）を auth と同じ firstFieldErrors で表示。
 */
export const MenuAddScreen = ({ route, navigation }: Props) => {
  const { date } = route.params;
  const addMenu = useMenuStore((s) => s.addMenu);

  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const result = menuFormSchema.safeParse({ name, budget });
    if (!result.success) {
      setErrors(firstFieldErrors(result.error));
      return;
    }
    setErrors({});
    setSaving(true);
    // 材料は改行/カンマ区切り → 配列化（空要素は除去）
    const ingredients = ingredientsText
      .split(/[\n,、]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    await addMenu({
      date,
      name: result.data.name,
      budget: result.data.budget,
      ingredients,
      photos: [],
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.dateLabel}>{formatDateJa(date)} の献立</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>料理名</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="例）カレーライス"
          placeholderTextColor={colors.textLight}
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>予算（円）</Text>
        <TextInput
          style={[styles.input, errors.budget && styles.inputError]}
          placeholder="例）800"
          placeholderTextColor={colors.textLight}
          value={budget}
          onChangeText={setBudget}
          keyboardType="number-pad"
        />
        {errors.budget && <Text style={styles.errorText}>{errors.budget}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>材料</Text>
        <TextInput
          style={[styles.input, { minHeight: 80 }]}
          placeholder="改行またはカンマ区切り（例）肉、玉ねぎ、じゃがいも"
          placeholderTextColor={colors.textLight}
          value={ingredientsText}
          onChangeText={setIngredientsText}
          multiline
        />
        <Text style={styles.hint}>改行 / カンマ / 「、」で区切って複数入力できます</Text>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={saving}
        accessibilityRole="button"
      >
        <Text style={styles.saveButtonText}>{saving ? '保存中…' : '保存'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
