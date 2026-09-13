import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import { QuickAddMenuInput } from './QuickAddMenuInput';

/**
 * molecule `QuickAddMenuInput` のストーリー。
 * 空のまま追加を押すとバリデーションエラーが出る（Actions には何も記録されない）。
 */
const meta: Meta<typeof QuickAddMenuInput> = {
  title: 'molecules/QuickAddMenuInput',
  component: QuickAddMenuInput,
  args: { onSubmit: fn(), compact: false },
  argTypes: { compact: { control: 'boolean' } },
};

export default meta;
type Story = StoryObj<typeof QuickAddMenuInput>;

export const Default: Story = {};

/** 週別ビューの列に置く圧縮版。 */
export const Compact: Story = {
  args: { compact: true, placeholder: '料理名' },
};
