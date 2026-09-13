import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type MenuViewMode, MenuViewModeTabs } from '@/components/molecules/MenuViewModeTabs';
import { PeriodNavigator } from '@/components/molecules/PeriodNavigator';
import { MenuDayBoard } from '@/components/organisms/MenuDayBoard';
import { MenuWeekBoard } from '@/components/organisms/MenuWeekBoard';
import { selectMenusForDate, selectMenusForWeek } from '@/features/menu/menuSelectors';
import type { MenuItem } from '@/schemas/domain';
import { quickAddToDraft } from '@/schemas/menu';
import { useMenuStore } from '@/stores/menuStore';
import type { MainStackParamList, MainTabParamList } from '@/types';
import { addDays, formatDateJa, formatWeekRangeJa, startOfWeek, todayKey } from '@/utils/date';
import { styles } from './MenuScreen.styles';

// 献立タブはタブ配下だが、MenuAdd は親のメインスタックにあるため両者を合成する
type MenuScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Menu'>,
  NativeStackNavigationProp<MainStackParamList>
>;

/**
 * page: 献立の一覧・管理（日別 / 週別）。
 *
 * 表示は menuStore（＝AsyncStorage 永続化）を購読し、並べ替え・週の切り出しは
 * features/menu の純関数に任せる。この画面が持つのは「いまどの期間のどの表示を見ているか」だけ。
 */
export const MenuScreen: React.FC = () => {
  const navigation = useNavigation<MenuScreenNavigationProp>();

  const [viewMode, setViewMode] = useState<MenuViewMode>('day');
  // 日別なら表示中の日、週別ならその日を含む週。1つの state で両モードを表す
  const [anchorDate, setAnchorDate] = useState(todayKey);

  const items = useMenuStore((s) => s.items);
  const loaded = useMenuStore((s) => s.loaded);
  const load = useMenuStore((s) => s.load);
  const addMenu = useMenuStore((s) => s.addMenu);
  const removeMenu = useMenuStore((s) => s.removeMenu);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const weekStart = useMemo(() => startOfWeek(anchorDate), [anchorDate]);
  const dayMenus = useMemo(() => selectMenusForDate(items, anchorDate), [items, anchorDate]);
  const weekMenus = useMemo(() => selectMenusForWeek(items, weekStart), [items, weekStart]);

  // 「今日」は描画のたびに評価する（日付をまたいだまま開きっぱなしでも追従する）
  const today = todayKey();
  const isWeek = viewMode === 'week';
  const step = isWeek ? 7 : 1;
  const atCurrentPeriod = isWeek ? weekStart === startOfWeek(today) : anchorDate === today;

  const handleQuickAdd = useCallback(
    (date: string, name: string) => {
      addMenu(quickAddToDraft(date, name));
    },
    [addMenu],
  );

  const handlePressMenu = useCallback(
    (menu: MenuItem) => {
      navigation.navigate('MenuAdd', { date: menu.date, menuId: menu.id });
    },
    [navigation],
  );

  const handleDeleteMenu = useCallback(
    (menu: MenuItem) => {
      Alert.alert('献立を削除', `「${menu.name}」を削除しますか？`, [
        { text: 'キャンセル', style: 'cancel' },
        { text: '削除', style: 'destructive', onPress: () => removeMenu(menu.id) },
      ]);
    },
    [removeMenu],
  );

  const handlePressDate = useCallback((date: string) => {
    setAnchorDate(date);
    setViewMode('day');
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>献立</Text>
          <MenuViewModeTabs testID="view-mode" value={viewMode} onChange={setViewMode} />
          <PeriodNavigator
            testID="period"
            label={isWeek ? formatWeekRangeJa(weekStart) : formatDateJa(anchorDate)}
            onPrev={() => setAnchorDate((date) => addDays(date, -step))}
            onNext={() => setAnchorDate((date) => addDays(date, step))}
            onReset={() => setAnchorDate(today)}
            resetLabel={isWeek ? '今週' : '今日'}
            resetDisabled={atCurrentPeriod}
          />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {isWeek ? (
            <MenuWeekBoard
              days={weekMenus}
              today={today}
              onQuickAdd={handleQuickAdd}
              onPressMenu={handlePressMenu}
              onDeleteMenu={handleDeleteMenu}
              onPressDate={handlePressDate}
            />
          ) : (
            <MenuDayBoard
              date={anchorDate}
              menus={dayMenus}
              onQuickAdd={(name) => handleQuickAdd(anchorDate, name)}
              onPressMenu={handlePressMenu}
              onDeleteMenu={handleDeleteMenu}
              onAddWithDetails={() => navigation.navigate('MenuAdd', { date: anchorDate })}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
