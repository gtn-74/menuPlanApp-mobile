import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MenuCard } from '@/components/molecules/MenuCard';
import { QuickAddMenuInput } from '@/components/molecules/QuickAddMenuInput';
import type { DayMenus } from '@/features/menu/menuSelectors';
import type { MenuItem } from '@/schemas/domain';
import { colors } from '@/theme/colors';
import { formatMonthDay, formatWeekdayJa } from '@/utils/date';
import { styles } from './MenuWeekBoard.styles';

interface MenuWeekBoardProps {
  /** 週の7日ぶん（献立0件の日も含む）。長さ7を前提にレイアウトする */
  days: DayMenus[];
  /** 今日の date key。該当する列を強調する */
  today: string;
  onQuickAdd: (date: string, name: string) => void;
  onPressMenu: (menu: MenuItem) => void;
  onDeleteMenu: (menu: MenuItem) => void;
  /** 列ヘッダのタップ。その日の日別ビューへ切り替える導線 */
  onPressDate: (date: string) => void;
}

/** 列の位置から週末の文字色を決める（0=日曜, 6=土曜。平日は色を付けない）。 */
function weekendTextStyle(index: number) {
  if (index === 0) return styles.sunday;
  if (index === 6) return styles.saturday;
  return undefined;
}

/**
 * organism: 1週間を7列の表として横に並べるボード。
 *
 * 列幅は固定（WEEK_COLUMN_WIDTH）で横スクロールさせる。画面幅を7等分すると
 * 1列 50px 前後になり料理名がほぼ読めないため、「一覧性より可読性」を取った形。
 * 縦スクロールは呼び出し側（画面）の ScrollView に任せる。
 */
export const MenuWeekBoard: React.FC<MenuWeekBoardProps> = ({
  days,
  today,
  onQuickAdd,
  onPressMenu,
  onDeleteMenu,
  onPressDate,
}) => {
  // 入力欄を開いている列。7列ぶん常時表示すると狭い列が埋まるので、同時に1つだけ開く
  const [addingDate, setAddingDate] = useState<string | null>(null);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      // 列内の入力欄をタップしたときに横スクロールが誤作動しないように
      keyboardShouldPersistTaps="handled"
    >
      {days.map(({ date, menus }, index) => {
        const isToday = date === today;
        const weekendStyle = weekendTextStyle(index);

        return (
          <View
            key={date}
            testID={`week-column-${date}`}
            style={[styles.column, isToday && styles.columnToday]}
          >
            <TouchableOpacity
              testID={`week-column-header-${date}`}
              accessibilityRole="button"
              accessibilityLabel={`${formatMonthDay(date)} の日別表示へ`}
              style={[styles.header, isToday && styles.headerToday]}
              onPress={() => onPressDate(date)}
            >
              <Text style={[styles.weekday, weekendStyle, isToday && styles.todayText]}>
                {formatWeekdayJa(date)}
              </Text>
              <Text style={[styles.monthDay, weekendStyle, isToday && styles.todayText]}>
                {formatMonthDay(date)}
              </Text>
            </TouchableOpacity>

            <View style={styles.cards}>
              {menus.map((menu) => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  compact
                  testID={`menu-card-${menu.id}`}
                  onPress={() => onPressMenu(menu)}
                  onDelete={() => onDeleteMenu(menu)}
                />
              ))}

              {addingDate === date ? (
                <QuickAddMenuInput
                  testID={`week-quick-add-${date}`}
                  compact
                  autoFocus
                  placeholder="料理名"
                  onSubmit={(name) => onQuickAdd(date, name)}
                />
              ) : (
                <TouchableOpacity
                  testID={`week-add-${date}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${formatMonthDay(date)} に献立を追加`}
                  style={styles.addButton}
                  onPress={() => setAddingDate(date)}
                >
                  <Ionicons name="add" size={14} color={colors.primary} />
                  <Text style={styles.addButtonText}>追加</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};
