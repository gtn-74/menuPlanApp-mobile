import { colors } from '@/theme/colors';
import type { BudgetItem, Event, MarkedDates, MenuItem, TodoItem } from '@/types';

export interface CategoryFlags {
  showMenu: boolean;
  showBudget: boolean;
  showPersonalEvents: boolean;
  showFamilyEvents: boolean;
  showTodo: boolean;
}

export interface BuildMarkedDatesInput {
  menus: MenuItem[];
  budgets: BudgetItem[];
  events: Event[];
  todos: TodoItem[];
  flags: CategoryFlags;
  selectedDate: string;
}

/**
 * カレンダーの「日付ごとの色ドット」を組み立てる純粋関数。
 *
 * 元は CalendarScreen の useMemo（約65行）に埋め込まれており、
 * 画面を描画しないと検証できなかった。純関数に切り出すことで
 * 「フラグの ON/OFF × データの有無 × 選択日」の組み合わせを
 * vitest で網羅テストできるようにした。
 *
 * 入力の menus/budgets/events/todos は「既にユーザー表示フィルタ済み」の想定。
 */
export function buildMarkedDates(input: BuildMarkedDatesInput): MarkedDates {
  const { menus, budgets, events, todos, flags, selectedDate } = input;
  const marked: MarkedDates = {};

  // 表示対象の日付を収集
  const dates = new Set<string>();
  if (flags.showMenu) for (const m of menus) dates.add(m.date);
  if (flags.showBudget) for (const b of budgets) dates.add(b.date);
  if (flags.showPersonalEvents || flags.showFamilyEvents) {
    for (const e of events) {
      if (
        (e.type === 'personal' && flags.showPersonalEvents) ||
        (e.type === 'family' && flags.showFamilyEvents)
      ) {
        dates.add(e.date);
      }
    }
  }
  if (flags.showTodo) for (const t of todos) dates.add(t.date);

  // 各日付にドットを付与
  for (const date of dates) {
    const dots: { key: string; color: string }[] = [];

    if (flags.showMenu && menus.some((m) => m.date === date)) {
      dots.push({ key: 'menu', color: colors.dots.menu });
    }
    if (flags.showBudget && budgets.some((b) => b.date === date)) {
      dots.push({ key: 'budget', color: colors.dots.budget });
    }
    if (
      flags.showPersonalEvents &&
      events.some((e) => e.date === date && e.type === 'personal')
    ) {
      dots.push({ key: 'personalEvent', color: colors.dots.personalEvent });
    }
    if (
      flags.showFamilyEvents &&
      events.some((e) => e.date === date && e.type === 'family')
    ) {
      dots.push({ key: 'familyEvent', color: colors.dots.familyEvent });
    }
    if (flags.showTodo && todos.some((t) => t.date === date)) {
      dots.push({ key: 'todo', color: colors.dots.todo });
    }

    if (dots.length > 0) {
      marked[date] = {
        dots,
        selected: date === selectedDate,
        selectedColor: colors.selectedDay,
      };
    }
  }

  // 選択日は必ずマーク（ドットが無くても選択表示する）
  if (!marked[selectedDate]) {
    marked[selectedDate] = {
      selected: true,
      selectedColor: colors.selectedDay,
    };
  }

  return marked;
}
