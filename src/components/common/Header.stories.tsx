import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import { Header } from './Header';

/**
 * organism `Header`: カテゴリ切替タブ＋月ナビ＋プロフィール導線。
 * Controls で selectedCategory / currentMonth を触れる。各コールバックは Actions に記録。
 */
const meta: Meta<typeof Header> = {
  title: 'organisms/Header',
  component: Header,
  args: {
    selectedCategory: 'all',
    currentMonth: '2026-01-15',
    onCategoryChange: fn(),
    onProfilePress: fn(),
    onTodayPress: fn(),
    onPrevMonth: fn(),
    onNextMonth: fn(),
  },
  argTypes: {
    selectedCategory: {
      control: 'select',
      options: ['all', 'menu', 'budget', 'todo'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const All: Story = {};

export const Budget: Story = {
  args: { selectedCategory: 'budget' },
};
