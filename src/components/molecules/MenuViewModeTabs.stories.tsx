import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import { MenuViewModeTabs } from './MenuViewModeTabs';

const meta: Meta<typeof MenuViewModeTabs> = {
  title: 'molecules/MenuViewModeTabs',
  component: MenuViewModeTabs,
  args: { value: 'day', onChange: fn() },
  argTypes: { value: { control: 'radio', options: ['day', 'week'] } },
};

export default meta;
type Story = StoryObj<typeof MenuViewModeTabs>;

export const Day: Story = {};
export const Week: Story = { args: { value: 'week' } };
