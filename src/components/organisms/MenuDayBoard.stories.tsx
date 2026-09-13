import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import type { MenuItem } from '@/schemas/domain';
import { MenuDayBoard } from './MenuDayBoard';

const menu = (id: string, name: string, budget: number, ingredients: string[]): MenuItem => ({
  id,
  date: '2026-01-05',
  name,
  budget,
  ingredients,
  photos: [],
  userId: 'user-1',
  familyGroupId: 'family-1',
  createdAt: '2026-01-04T10:00:00Z',
});

const meta: Meta<typeof MenuDayBoard> = {
  title: 'organisms/MenuDayBoard',
  component: MenuDayBoard,
  args: {
    date: '2026-01-05',
    menus: [
      menu('1', 'カレーライス', 800, ['豚肉', '玉ねぎ', 'じゃがいも', 'にんじん']),
      menu('2', 'サラダ', 200, ['レタス', 'トマト']),
    ],
    onQuickAdd: fn(),
    onPressMenu: fn(),
    onDeleteMenu: fn(),
    onAddWithDetails: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof MenuDayBoard>;

export const Planned: Story = {};

/** その日の献立がまだ無い状態。 */
export const Empty: Story = {
  args: { menus: [] },
};

/** クイック追加だけで登録した状態（予算・材料が未入力）。 */
export const QuickAddedOnly: Story = {
  args: { menus: [menu('1', '肉じゃが', 0, []), menu('2', '味噌汁', 0, [])] },
};
