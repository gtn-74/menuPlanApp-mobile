import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { firstFieldErrors } from '@/schemas/auth';
import { menuFormSchema } from '@/schemas/menu';
import { useMenuStore } from '@/stores/menuStore';
import { colors } from '@/theme/colors';
import type { MainStackParamList } from '@/types';
import { formatDateJa } from '@/utils/date';
import { styles } from './MenuAddScreen.styles';

type Props = NativeStackScreenProps<MainStackParamList, 'MenuAdd'>;

/**
 * page: 献立の詳細フォーム。route.params の menuId の有無で「追加」と「編集」を兼ねる。
 * 保存は menuStore（→repository）経由。
 * バリデーションは zod（menuFormSchema）を auth と同じ firstFieldErrors で表示。
 */
export const MenuAddScreen = ({ route, navigation }: Props) => {
  const { date, menuId } = route.params;

  const items = useMenuStore((s) => s.items);
  const loaded = useMenuStore((s) => s.loaded);
  const load = useMenuStore((s) => s.load);
  const addMenu = useMenuStore((s) => s.addMenu);
  const updateMenu = useMenuStore((s) => s.updateMenu);
  const removeMenu = useMenuStore((s) => s.removeMenu);

  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // 編集対象。この画面を直接開いた場合に備え、未ロードなら読み込む
  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const editing = useMemo(
    () => (menuId ? items.find((item) => item.id === menuId) : undefined),
    [items, menuId],
  );

  // 既存値をフォームへ流し込むのは最初の1回だけ。
  // 以降は items が更新されても入力中の内容を上書きしない（保存直後の巻き戻り防止）。
  const [prefilled, setPrefilled] = useState(!menuId);
  useEffect(() => {
    if (prefilled || !editing) return;
    setName(editing.name);
    // 予算は任意項目。0（未入力）なら空欄のまま見せる
    setBudget(editing.budget > 0 ? String(editing.budget) : '');
    setIngredientsText(editing.ingredients.join('\n'));
    setPrefilled(true);
  }, [editing, prefilled]);

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
    const draft = {
      date,
      name: result.data.name,
      budget: result.data.budget,
      ingredients,
      photos: [],
    };
    try {
      if (menuId) {
        await updateMenu(menuId, draft);
      } else {
        await addMenu(draft);
      }
      navigation.goBack();
    } finally {
      // 保存に失敗しても操作不能にならないようボタンを戻す
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!menuId) return;
    Alert.alert('献立を削除', `「${editing?.name ?? 'この献立'}」を削除しますか？`, [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          await removeMenu(menuId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.dateLabel}>{formatDateJa(date)} の献立</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>料理名</Text>
        <TextInput
          testID="menu-name"
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
          testID="menu-budget"
          style={[styles.input, errors.budget && styles.inputError]}
          placeholder="任意（例）800"
          placeholderTextColor={colors.textLight}
          value={budget}
          onChangeText={setBudget}
          keyboardType="number-pad"
        />
        {errors.budget && <Text style={styles.errorText}>{errors.budget}</Text>}
        <Text style={styles.hint}>未入力でも保存できます</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>材料</Text>
        <TextInput
          testID="menu-ingredients"
          style={[styles.input, styles.multilineInput]}
          placeholder="改行またはカンマ区切り（例）肉、玉ねぎ、じゃがいも"
          placeholderTextColor={colors.textLight}
          value={ingredientsText}
          onChangeText={setIngredientsText}
          multiline
        />
        <Text style={styles.hint}>改行 / カンマ / 「、」で区切って複数入力できます</Text>
      </View>

      <TouchableOpacity
        testID="menu-save"
        style={styles.saveButton}
        onPress={handleSave}
        disabled={saving}
        accessibilityRole="button"
      >
        <Text style={styles.saveButtonText}>{saving ? '保存中…' : '保存'}</Text>
      </TouchableOpacity>

      {menuId && (
        <TouchableOpacity
          testID="menu-delete"
          style={styles.deleteButton}
          onPress={handleDelete}
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
          <Text style={styles.deleteButtonText}>この献立を削除</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};
