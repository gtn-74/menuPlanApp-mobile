import { describe, expect, it } from 'vitest';
import { colors } from '@/theme/colors';
import type { BudgetItem, Event, MenuItem, TodoItem } from '@/types';
import { buildMarkedDates, type CategoryFlags } from './buildMarkedDates';

// --- テスト用のデータビルダー（必要な項目だけ埋め、あとは既定値） ---
const menu = (date: string): MenuItem => ({
  id: `m-${date}`,
  date,
  name: '料理',
  budget: 0,
  ingredients: [],
  photos: [],
  userId: 'u',
  familyGroupId: 'f',
  createdAt: '',
});
const budget = (date: string): BudgetItem => ({
  id: `b-${date}`,
  date,
  category: 'food',
  amount: -100,
  description: '',
  userId: 'u',
  familyGroupId: 'f',
  createdAt: '',
});
const event = (date: string, type: Event['type']): Event => ({
  id: `e-${date}-${type}`,
  date,
  title: '予定',
  time: '10:00',
  type,
  userId: 'u',
  createdAt: '',
});
const todo = (date: string): TodoItem => ({
  id: `t-${date}`,
  date,
  title: 'やること',
  completed: false,
  priority: 'high',
  userId: 'u',
  createdAt: '',
});

const ALL_ON: CategoryFlags = {
  showMenu: true,
  showBudget: true,
  showPersonalEvents: true,
  showFamilyEvents: true,
  showTodo: true,
};
const ALL_OFF: CategoryFlags = {
  showMenu: false,
  showBudget: false,
  showPersonalEvents: false,
  showFamilyEvents: false,
  showTodo: false,
};

const empty = { menus: [], budgets: [], events: [], todos: [] };

describe('buildMarkedDates', () => {
  it('献立だけの日には menu ドットが1つ付く', () => {
    const marked = buildMarkedDates({
      ...empty,
      menus: [menu('2026-01-10')],
      flags: ALL_ON,
      selectedDate: '2026-01-01',
    });
    expect(marked['2026-01-10'].dots).toEqual([{ key: 'menu', color: colors.dots.menu }]);
  });

  it('同じ日に複数カテゴリがあるとドットが順番に積まれる', () => {
    const d = '2026-01-10';
    const marked = buildMarkedDates({
      menus: [menu(d)],
      budgets: [budget(d)],
      events: [event(d, 'personal'), event(d, 'family')],
      todos: [todo(d)],
      flags: ALL_ON,
      selectedDate: '2026-01-01',
    });
    expect(marked[d].dots?.map((x) => x.key)).toEqual([
      'menu',
      'budget',
      'personalEvent',
      'familyEvent',
      'todo',
    ]);
  });

  it('フラグが OFF のカテゴリはドットにならない', () => {
    const d = '2026-01-10';
    const marked = buildMarkedDates({
      menus: [menu(d)],
      budgets: [budget(d)],
      events: [],
      todos: [],
      flags: { ...ALL_OFF, showMenu: true }, // 献立だけ表示
      selectedDate: '2026-01-01',
    });
    expect(marked[d].dots?.map((x) => x.key)).toEqual(['menu']);
  });

  it('personal/family は各フラグで出し分けられる', () => {
    const d = '2026-01-10';
    const onlyFamily = buildMarkedDates({
      ...empty,
      events: [event(d, 'personal'), event(d, 'family')],
      flags: { ...ALL_OFF, showFamilyEvents: true },
      selectedDate: '2026-01-01',
    });
    expect(onlyFamily[d].dots?.map((x) => x.key)).toEqual(['familyEvent']);
  });

  it('選択日はデータが無くても必ずマークされる', () => {
    const marked = buildMarkedDates({ ...empty, flags: ALL_ON, selectedDate: '2026-01-01' });
    expect(marked['2026-01-01']).toEqual({
      selected: true,
      selectedColor: colors.selectedDay,
    });
  });

  it('選択日にドットがある場合は selected:true が付く', () => {
    const d = '2026-01-10';
    const marked = buildMarkedDates({
      ...empty,
      menus: [menu(d)],
      flags: ALL_ON,
      selectedDate: d,
    });
    expect(marked[d].selected).toBe(true);
    expect(marked[d].dots).toHaveLength(1);
  });
});
