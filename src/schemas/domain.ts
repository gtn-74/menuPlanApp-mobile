import { z } from 'zod';

/**
 * ドメインの単一の真実源（schema-first）。
 * 型は各スキーマから `z.infer` で導出し、手書き interface と二重管理しない。
 * 外部入力（API / AsyncStorage / リンク）は各入口でこれらのスキーマで検証する。
 */

export const CategoryFilterSchema = z.enum(['all', 'menu', 'budget', 'todo']);
export const EventTypeSchema = z.enum(['personal', 'family']);
export const PrioritySchema = z.enum(['high', 'medium', 'low']);

// 日付/時刻は zod 組み込みの ISO 形式で厳密に検証（型は string のまま）。
// z.iso.date は YYYY-MM-DD を検証し、存在しない日付（2026-13-40 等）も弾く。
const isoDate = z.iso.date('YYYY-MM-DD 形式で指定してください');
const isoTime = z.iso.time('HH:mm 形式で指定してください');

export const MenuItemSchema = z.object({
  id: z.string(),
  date: isoDate,
  name: z.string(),
  budget: z.number(),
  ingredients: z.array(z.string()),
  photos: z.array(z.string()),
  userId: z.string(),
  familyGroupId: z.string(),
  createdAt: z.string(),
});

export const BudgetItemSchema = z.object({
  id: z.string(),
  date: isoDate,
  category: z.string(),
  amount: z.number(), // 負の値は支出
  description: z.string(),
  userId: z.string(),
  familyGroupId: z.string(),
  createdAt: z.string(),
});

export const EventSchema = z.object({
  id: z.string(),
  date: isoDate,
  title: z.string(),
  time: isoTime,
  type: EventTypeSchema,
  userId: z.string(),
  familyGroupId: z.string().optional(),
  createdAt: z.string(),
});

export const TodoItemSchema = z.object({
  id: z.string(),
  date: isoDate,
  title: z.string(),
  completed: z.boolean(),
  priority: PrioritySchema,
  userId: z.string(), // 作成者
  assignedTo: z.string().optional(), // 割り振り先ユーザーID
  familyGroupId: z.string().optional(),
  createdAt: z.string(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
});

export const DayDataSchema = z.object({
  date: isoDate,
  menus: z.array(MenuItemSchema),
  budgets: z.array(BudgetItemSchema),
  events: z.array(EventSchema),
  todos: z.array(TodoItemSchema),
});

export const FilterStateSchema = z.object({
  showMenu: z.boolean(),
  showBudget: z.boolean(),
  showPersonalEvents: z.boolean(),
  showFamilyEvents: z.boolean(),
  showTodo: z.boolean(),
  selectedCategory: CategoryFilterSchema,
  visibleUserIds: z.array(z.string()), // 表示するユーザーのID
  quickFilterUserIds: z.array(z.string()), // クイックフィルターに表示するユーザーのID
});

// --- スキーマから導出した型（手書き interface の置き換え） ---
export type CategoryFilter = z.infer<typeof CategoryFilterSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type BudgetItem = z.infer<typeof BudgetItemSchema>;
export type Event = z.infer<typeof EventSchema>;
export type TodoItem = z.infer<typeof TodoItemSchema>;
export type User = z.infer<typeof UserSchema>;
export type DayData = z.infer<typeof DayDataSchema>;
export type FilterState = z.infer<typeof FilterStateSchema>;
