import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { CalendarLayout } from './CalendarLayout';

/**
 * template `CalendarLayout` のストーリー。
 * 状態を持たない「配置の器」なので、slot にダミーの中身を差し込んで構造を確認する。
 */
const meta: Meta<typeof CalendarLayout> = {
  title: 'templates/CalendarLayout',
  component: CalendarLayout,
};

export default meta;
type Story = StoryObj<typeof CalendarLayout>;

export const Basic: Story = {
  args: {
    header: (
      <View style={{ padding: 16, backgroundColor: '#FF9800' }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>ヘッダー</Text>
      </View>
    ),
    calendar: (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>カレンダー本体</Text>
      </View>
    ),
    userFilter: <Text>フィルタ列</Text>,
  },
};
