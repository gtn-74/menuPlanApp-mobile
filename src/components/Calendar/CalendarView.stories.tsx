import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { fn } from 'storybook/test';
import { mockBudgetItems, mockEvents, mockMenuItems, mockTodoItems } from '@/mocks/data';
import { colors } from '@/theme/colors';
import type { MarkedDates } from '@/types';
import { CalendarView } from './CalendarView';

/**
 * organism `CalendarView`: react-native-calendars ＋ 独自ラベル/週番号/スワイプ。
 * GestureDetector を使うため GestureHandlerRootView でラップして表示する。
 * データは props 注入（mock）。onDayPress は Actions に記録。
 */
const markedDates: MarkedDates = {
  '2026-01-15': { selected: true, selectedColor: colors.selectedDay },
};

const meta: Meta<typeof CalendarView> = {
  title: 'organisms/CalendarView',
  component: CalendarView,
  args: {
    selectedDate: '2026-01-15',
    currentMonth: '2026-01-15',
    markedDates,
    menuItems: mockMenuItems,
    events: mockEvents,
    budgetItems: mockBudgetItems,
    todoItems: mockTodoItems,
    onDayPress: fn(),
    onPrevMonth: fn(),
    onNextMonth: fn(),
  },
  decorators: [
    (Story) => (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Story />
      </GestureHandlerRootView>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CalendarView>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    menuItems: [],
    events: [],
    budgetItems: [],
    todoItems: [],
  },
};
