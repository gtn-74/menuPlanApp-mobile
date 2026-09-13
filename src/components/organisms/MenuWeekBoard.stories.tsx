import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import type { DayMenus } from '@/features/menu/menuSelectors';
import type { MenuItem } from '@/schemas/domain';
import { MenuWeekBoard } from './MenuWeekBoard';

const menu = (id: string, date: string, name: string, budget = 0): MenuItem => ({
  id,
  date,
  name,
  budget,
  ingredients: [],
  photos: [],
  userId: 'user-1',
  familyGroupId: 'family-1',
  createdAt: '2026-01-04T10:00:00Z',
});

const WEEK = [
  '2026-01-04',
  '2026-01-05',
  '2026-01-06',
  '2026-01-07',
  '2026-01-08',
  '2026-01-09',
  '2026-01-10',
];

const emptyWeek: DayMenus[] = WEEK.map((date) => ({ date, menus: [] }));

const plannedWeek: DayMenus[] = [
  { date: '2026-01-04', menus: [menu('1', '2026-01-04', 'お雑煮', 500)] },
  {
    date: '2026-01-05',
    menus: [menu('2', '2026-01-05', 'カレーライス', 800), menu('3', '2026-01-05', 'サラダ')],
  },
  { date: '2026-01-06', menus: [] },
  { date: '2026-01-07', menus: [menu('4', '2026-01-07', '七草粥', 300)] },
  { date: '2026-01-08', menus: [] },
  { date: '2026-01-09', menus: [menu('5', '2026-01-09', '鶏むね肉のさっぱり南蛮漬け')] },
  { date: '2026-01-10', menus: [menu('6', '2026-01-10', '鍋', 1200)] },
];

/**
 * organism `MenuWeekBoard` のストーリー。
 * 横スクロールする7列の表。列ヘッダをタップすると日別へ、「追加」で列内に入力欄が開く。
 */
const meta: Meta<typeof MenuWeekBoard> = {
  title: 'organisms/MenuWeekBoard',
  component: MenuWeekBoard,
  args: {
    days: plannedWeek,
    today: '2026-01-05',
    onQuickAdd: fn(),
    onPressMenu: fn(),
    onDeleteMenu: fn(),
    onPressDate: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof MenuWeekBoard>;

export const Planned: Story = {};

/** まだ1件も登録していない週。 */
export const Empty: Story = {
  args: { days: emptyWeek },
};

/** 今日を含まない週（＝強調される列が無い状態）。 */
export const OtherWeek: Story = {
  args: { today: '2026-02-01' },
};
