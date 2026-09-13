import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MenuCard } from '@/components/molecules/MenuCard';
import { QuickAddMenuInput } from '@/components/molecules/QuickAddMenuInput';
import { sumBudget } from '@/features/menu/menuSelectors';
import type { MenuItem } from '@/schemas/domain';
import { colors } from '@/theme/colors';
import { formatDateJa } from '@/utils/date';
import { styles } from './MenuDayBoard.styles';

interface MenuDayBoardProps {
  date: string;
  menus: MenuItem[];
  /** 料理名だけのクイック追加 */
  onQuickAdd: (name: string) => void;
  /** 献立をタップ（詳細フォームで編集） */
  onPressMenu: (menu: MenuItem) => void;
  /** 削除アイコンをタップ（確認ダイアログは画面側） */
  onDeleteMenu: (menu: MenuItem) => void;
  /** 予算・材料まで入れて追加したいときの導線 */
  onAddWithDetails: () => void;
}

/**
 * organism: 1日ぶんの献立を縦に並べ、その場で追加できるボード。
 * データ取得も保存も持たず、受け取った menus を描き、操作を上へ通知するだけ。
 */
export const MenuDayBoard: React.FC<MenuDayBoardProps> = ({
  date,
  menus,
  onQuickAdd,
  onPressMenu,
  onDeleteMenu,
  onAddWithDetails,
}) => {
  const total = sumBudget(menus);

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.dateLabel}>{formatDateJa(date)}</Text>
        <Text style={styles.countLabel}>
          {menus.length > 0 ? `${menus.length}品` : '未登録'}
          {total > 0 && ` ・ 合計 ¥${total.toLocaleString()}`}
        </Text>
      </View>

      {menus.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="restaurant-outline" size={32} color={colors.textLight} />
          <Text style={styles.emptyText}>この日の献立はまだありません</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {menus.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              testID={`menu-card-${menu.id}`}
              onPress={() => onPressMenu(menu)}
              onDelete={() => onDeleteMenu(menu)}
            />
          ))}
        </View>
      )}

      <QuickAddMenuInput testID="day-quick-add" onSubmit={onQuickAdd} />

      <TouchableOpacity
        testID="day-add-with-details"
        accessibilityRole="button"
        style={styles.detailButton}
        onPress={onAddWithDetails}
      >
        <Ionicons name="create-outline" size={16} color={colors.primary} />
        <Text style={styles.detailButtonText}>予算・材料も入力して追加</Text>
      </TouchableOpacity>
    </View>
  );
};
