import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import { UserFilterButton } from './UserFilterButton';

/**
 * molecule `UserFilterButton` のストーリー。
 * Controls で name / isVisible を触れ、onPress は Actions に記録される。
 * （@expo/vector-icons を使うので RNW 変換の検証も兼ねる）
 */
const meta: Meta<typeof UserFilterButton> = {
  title: 'molecules/UserFilterButton',
  component: UserFilterButton,
  args: { name: 'パパ', isVisible: true, onPress: fn() },
  argTypes: { isVisible: { control: 'boolean' } },
};

export default meta;
type Story = StoryObj<typeof UserFilterButton>;

export const Visible: Story = {};

export const Inactive: Story = {
  args: { isVisible: false },
};
