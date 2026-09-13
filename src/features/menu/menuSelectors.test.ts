import { describe, expect, it } from 'vitest';
import type { MenuItem } from '@/schemas/domain';
import {
  groupMenusByDate,
  selectMenusForDate,
  selectMenusForWeek,
  sumBudget,
} from './menuSelectors';

const menu = (
  id: string,
  date: string,
  name: string,
  createdAt: string,
  budget = 0,
): MenuItem => ({
  id,
  date,
  name,
  budget,
  ingredients: [],
  photos: [],
  userId: 'user-1',
  familyGroupId: 'family-1',
  createdAt,
});

// 2026-01-04(日) 始まりの週に散らしたデータ。意図的に日付順で並べていない。
const items: MenuItem[] = [
  menu('b', '2026-01-05', 'カレー', '2026-01-01T10:00:00Z', 800),
  menu('a', '2026-01-04', 'お雑煮', '2026-01-01T09:00:00Z', 500),
  menu('c', '2026-01-05', '味噌汁', '2026-01-01T11:00:00Z', 200),
  menu('d', '2026-01-11', '来週のごはん', '2026-01-01T12:00:00Z', 1000),
];

describe('groupMenusByDate', () => {
  it('date key ごとにまとめる', () => {
    const grouped = groupMenusByDate(items);
    expect(Object.keys(grouped).sort()).toEqual(['2026-01-04', '2026-01-05', '2026-01-11']);
    expect(grouped['2026-01-05']).toHaveLength(2);
  });

  it('各日の中は createdAt 昇順に並ぶ', () => {
    const grouped = groupMenusByDate(items);
    expect(grouped['2026-01-05']?.map((m) => m.name)).toEqual(['カレー', '味噌汁']);
  });

  it('createdAt が同着なら id で決着し、順番が安定する', () => {
    const same = [
      menu('z', '2026-01-04', 'Z', '2026-01-01T09:00:00Z'),
      menu('y', '2026-01-04', 'Y', '2026-01-01T09:00:00Z'),
    ];
    expect(groupMenusByDate(same)['2026-01-04']?.map((m) => m.id)).toEqual(['y', 'z']);
    expect(groupMenusByDate([...same].reverse())['2026-01-04']?.map((m) => m.id)).toEqual([
      'y',
      'z',
    ]);
  });

  it('入力配列を破壊しない', () => {
    const input = [...items];
    const order = input.map((m) => m.id);
    groupMenusByDate(input);
    expect(input.map((m) => m.id)).toEqual(order);
  });

  it('空配列なら空オブジェクト', () => {
    expect(groupMenusByDate([])).toEqual({});
  });
});

describe('selectMenusForDate', () => {
  it('その日のぶんだけを作成順で返す', () => {
    expect(selectMenusForDate(items, '2026-01-05').map((m) => m.name)).toEqual([
      'カレー',
      '味噌汁',
    ]);
  });

  it('該当なしは空配列', () => {
    expect(selectMenusForDate(items, '2026-01-06')).toEqual([]);
  });
});

describe('selectMenusForWeek', () => {
  it('献立が0件の日も含めて必ず7日ぶん返す', () => {
    const week = selectMenusForWeek(items, '2026-01-04');
    expect(week).toHaveLength(7);
    expect(week.map((d) => d.date)).toEqual([
      '2026-01-04',
      '2026-01-05',
      '2026-01-06',
      '2026-01-07',
      '2026-01-08',
      '2026-01-09',
      '2026-01-10',
    ]);
    expect(week[2]?.menus).toEqual([]);
  });

  it('週の外の献立は含めない', () => {
    const week = selectMenusForWeek(items, '2026-01-04');
    expect(week.flatMap((d) => d.menus).map((m) => m.name)).not.toContain('来週のごはん');
  });

  it('翌週を渡せば翌週のぶんが入る', () => {
    const week = selectMenusForWeek(items, '2026-01-11');
    expect(week[0]?.menus.map((m) => m.name)).toEqual(['来週のごはん']);
  });
});

describe('sumBudget', () => {
  it('予算を合計する', () => {
    expect(sumBudget(selectMenusForDate(items, '2026-01-05'))).toBe(1000);
  });

  it('空配列は 0', () => {
    expect(sumBudget([])).toBe(0);
  });
});
