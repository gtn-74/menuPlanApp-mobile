import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import type { MenuItem } from '@/schemas/domain';
import { MenuCard } from './MenuCard';

const baseMenu: MenuItem = {
  id: 'm1',
  date: '2026-01-05',
  name: 'カレーライス',
  budget: 800,
  ingredients: ['豚肉', '玉ねぎ', 'じゃがいも', 'にんじん'],
  photos: [],
  userId: 'user-1',
  familyGroupId: 'family-1',
  createdAt: '2026-01-04T10:00:00Z',
};

/**
 * molecule `MenuCard` のストーリー。
 * 日別ビュー（通常）と週別ビューの列（compact）で見え方が変わるので、両方を並べて確認できるようにする。
 */
const meta: Meta<typeof MenuCard> = {
  title: 'molecules/MenuCard',
  component: MenuCard,
  args: { menu: baseMenu, onPress: fn(), onDelete: fn(), compact: false },
  argTypes: { compact: { control: 'boolean' } },
};

export default meta;
type Story = StoryObj<typeof MenuCard>;

export const Default: Story = {};

/** 週別ビューの狭い列での表示。材料を省き、料理名は2行まで折り返す。 */
export const Compact: Story = {
  args: { compact: true },
};

/** クイック追加した直後の状態（料理名だけ・予算未入力）。 */
export const QuickAdded: Story = {
  args: { menu: { ...baseMenu, name: '肉じゃが', budget: 0, ingredients: [] } },
};

/** 列幅に収まらない長い料理名。 */
export const LongName: Story = {
  args: {
    menu: { ...baseMenu, name: '鶏むね肉のさっぱり南蛮漬けと季節野菜の彩り添え' },
    compact: true,
  },
};
