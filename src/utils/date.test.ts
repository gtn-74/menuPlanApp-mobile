import { describe, expect, it } from 'vitest';
import { formatDateJa } from './date';

/**
 * 純ロジックのテスト観点:
 *  - 代表値 / 曜日の境界（日曜・土曜）/ 月またぎ など入力の幅を押さえる
 */
describe('formatDateJa', () => {
  it('平日を「M月D日（曜）」に整形する', () => {
    // 2026-01-05 は月曜
    expect(formatDateJa('2026-01-05')).toBe('1月5日（月）');
  });

  it('曜日の境界（日曜/土曜）を正しく出す', () => {
    expect(formatDateJa('2026-01-04')).toBe('1月4日（日）'); // 日曜
    expect(formatDateJa('2026-01-03')).toBe('1月3日（土）'); // 土曜
  });

  it('2桁の月日も扱える', () => {
    expect(formatDateJa('2026-12-25')).toBe('12月25日（金）');
  });
});
