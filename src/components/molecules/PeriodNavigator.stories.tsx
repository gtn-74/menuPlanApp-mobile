import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import { PeriodNavigator } from './PeriodNavigator';

const meta: Meta<typeof PeriodNavigator> = {
  title: 'molecules/PeriodNavigator',
  component: PeriodNavigator,
  args: {
    label: '1月5日（月）',
    resetLabel: '今日',
    resetDisabled: false,
    onPrev: fn(),
    onNext: fn(),
    onReset: fn(),
  },
  argTypes: { resetDisabled: { control: 'boolean' } },
};

export default meta;
type Story = StoryObj<typeof PeriodNavigator>;

export const Day: Story = {};

/** 週別ビューのヘッダ。ラベルが長くても矢印の位置は動かない。 */
export const Week: Story = {
  args: { label: '1月4日 〜 1月10日', resetLabel: '今週' },
};

/** 既に今日/今週を見ているとき。 */
export const AtCurrentPeriod: Story = {
  args: { resetDisabled: true },
};
