import { describe, expect, it } from 'vitest';
import { EventSchema, FilterStateSchema, MenuItemSchema, TodoItemSchema } from './domain';

/**
 * スキーマのテスト観点:
 *  - 正しい形は parse できる（＝型と実行時検証が一致）
 *  - 欠損 / 型違い / 未知の列挙値 は弾く（＝壊れた入力を境界で止められる）
 */
describe('domain schemas', () => {
  const validMenu = {
    id: 'm1',
    date: '2026-01-10',
    name: 'カレー',
    budget: 800,
    ingredients: ['肉', '玉ねぎ'],
    photos: [],
    userId: 'user-1',
    familyGroupId: 'f1',
    createdAt: '2026-01-09T00:00:00Z',
  };

  it('MenuItem: 正しい形は通る', () => {
    expect(MenuItemSchema.safeParse(validMenu).success).toBe(true);
  });

  it('MenuItem: 必須欠損は弾く', () => {
    const { name: _omitted, ...missing } = validMenu;
    expect(MenuItemSchema.safeParse(missing).success).toBe(false);
  });

  it('MenuItem: 型違い（budgetが文字列）は弾く', () => {
    expect(MenuItemSchema.safeParse({ ...validMenu, budget: '800' }).success).toBe(false);
  });

  it('MenuItem: date は YYYY-MM-DD 以外・存在しない日付を弾く', () => {
    expect(MenuItemSchema.safeParse({ ...validMenu, date: '2026-1-1' }).success).toBe(false);
    expect(MenuItemSchema.safeParse({ ...validMenu, date: '2026-13-40' }).success).toBe(false);
    expect(MenuItemSchema.safeParse({ ...validMenu, date: '2026/01/10' }).success).toBe(false);
  });

  it('Event: type は personal/family 以外を弾く', () => {
    const base = {
      id: 'e1',
      date: '2026-01-10',
      title: '会議',
      time: '10:00',
      userId: 'user-1',
      createdAt: '',
    };
    expect(EventSchema.safeParse({ ...base, type: 'personal' }).success).toBe(true);
    expect(EventSchema.safeParse({ ...base, type: 'work' }).success).toBe(false);
  });

  it('TodoItem: priority の列挙を検証、assignedTo は任意', () => {
    const base = {
      id: 't1',
      date: '2026-01-10',
      title: '買い物',
      completed: false,
      priority: 'high',
      userId: 'user-1',
      createdAt: '',
    };
    expect(TodoItemSchema.safeParse(base).success).toBe(true);
    expect(TodoItemSchema.safeParse({ ...base, priority: 'urgent' }).success).toBe(false);
  });

  it('FilterState: selectedCategory は既知の値のみ', () => {
    const base = {
      showMenu: true,
      showBudget: true,
      showPersonalEvents: true,
      showFamilyEvents: true,
      showTodo: true,
      selectedCategory: 'all',
      visibleUserIds: ['user-1'],
      quickFilterUserIds: ['user-1'],
    };
    expect(FilterStateSchema.safeParse(base).success).toBe(true);
    expect(FilterStateSchema.safeParse({ ...base, selectedCategory: 'xxx' }).success).toBe(false);
  });
});
