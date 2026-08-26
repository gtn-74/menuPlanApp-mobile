import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Dot } from './Dot';

/**
 * atom `Dot` のストーリー。
 * Controls(args) で color / size をブラウザ上から触れる。
 */
const meta: Meta<typeof Dot> = {
  title: 'atoms/Dot',
  component: Dot,
  args: { color: '#FF9800', size: 12 },
  argTypes: {
    color: { control: 'color' },
    size: { control: { type: 'range', min: 4, max: 40, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof Dot>;

export const Default: Story = {};

export const Large: Story = {
  args: { size: 28, color: '#E91E63' },
};
