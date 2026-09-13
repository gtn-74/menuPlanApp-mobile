import type { MenuItem } from '@/schemas/domain';
import { buildWeekDates } from '@/utils/date';

/** 1日分の献立。週別ビューの「1列」がちょうどこの単位。 */
export interface DayMenus {
  date: string;
  menus: MenuItem[];
}

/**
 * 表示順を作成順（createdAt 昇順）で固定する比較関数。
 * createdAt が同着（同じミリ秒に連続登録）でも id で決着させ、
 * 再レンダリングのたびに順番が入れ替わらないようにする。
 */
function byCreatedAt(a: MenuItem, b: MenuItem): number {
  if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? -1 : 1;
  if (a.id === b.id) return 0;
  return a.id < b.id ? -1 : 1;
}

/**
 * 献立を date key ごとにまとめる。
 * 週別ビューは1日ずつ filter すると O(7n) 走査になるため、1回の走査で引けるようにする。
 * 返す配列は新規に組み立てたものなので、store の items を破壊しない。
 */
export function groupMenusByDate(items: MenuItem[]): Record<string, MenuItem[]> {
  const grouped: Record<string, MenuItem[]> = {};
  for (const item of items) {
    const list = grouped[item.date];
    if (list) {
      list.push(item);
    } else {
      grouped[item.date] = [item];
    }
  }
  for (const list of Object.values(grouped)) {
    list.sort(byCreatedAt);
  }
  return grouped;
}

/** 指定日の献立だけを作成順で取り出す（日別ビュー用）。 */
export function selectMenusForDate(items: MenuItem[], date: string): MenuItem[] {
  return items.filter((item) => item.date === date).sort(byCreatedAt);
}

/**
 * 週の起点（日曜）から7日分を、献立が0件の日も含めて返す（週別ビュー用）。
 * 「空の日も列として出す」ことがこの関数の主目的なので、必ず長さ7になる。
 */
export function selectMenusForWeek(items: MenuItem[], weekStart: string): DayMenus[] {
  const grouped = groupMenusByDate(items);
  return buildWeekDates(weekStart).map((date) => ({ date, menus: grouped[date] ?? [] }));
}

/** 予算の合計。未入力の献立は 0 なので、そのまま足して問題ない。 */
export function sumBudget(items: MenuItem[]): number {
  return items.reduce((total, item) => total + item.budget, 0);
}
