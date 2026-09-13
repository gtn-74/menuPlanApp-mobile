import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { MenuItem } from '@/schemas/domain';
import { colors } from '@/theme/colors';
import { styles } from './MenuCard.styles';

interface MenuCardProps {
  menu: MenuItem;
  /** カード本体のタップ（詳細フォームを開く想定） */
  onPress: () => void;
  /** 削除アイコンのタップ。確認ダイアログは呼び出し側の責務（このコンポーネントは状態を持たない） */
  onDelete: () => void;
  /** 週別ビューの狭い列で使う圧縮表示。材料を省き、料理名を2行まで折り返す */
  compact?: boolean;
  testID?: string;
}

/**
 * molecule: 献立1件のカード。「表示」と「2つの操作（開く/削除）」だけを持つ。
 * 確認ダイアログや削除処理は持たないので、日別ビュー・週別ビューの双方から同じ形で使える。
 */
export const MenuCard: React.FC<MenuCardProps> = ({
  menu,
  onPress,
  onDelete,
  compact = false,
  testID,
}) => {
  const ingredients = menu.ingredients.slice(0, 3).join('、');

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <TouchableOpacity
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={`${menu.name} を編集`}
        style={styles.body}
        onPress={onPress}
      >
        <Text style={[styles.name, compact && styles.nameCompact]} numberOfLines={compact ? 2 : 1}>
          {menu.name}
        </Text>

        {/* 予算は任意入力。0（未入力）のときは行ごと出さない */}
        {menu.budget > 0 && <Text style={styles.budget}>¥{menu.budget.toLocaleString()}</Text>}

        {!compact && ingredients.length > 0 && (
          <Text style={styles.ingredients} numberOfLines={1}>
            {ingredients}
            {menu.ingredients.length > 3 && '…'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        testID={testID ? `${testID}-delete` : undefined}
        accessibilityRole="button"
        accessibilityLabel={`${menu.name} を削除`}
        style={styles.deleteButton}
        onPress={onDelete}
        // 小さいアイコンでも押しやすいようタップ領域を広げる
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close" size={compact ? 14 : 16} color={colors.textLight} />
      </TouchableOpacity>
    </View>
  );
};
