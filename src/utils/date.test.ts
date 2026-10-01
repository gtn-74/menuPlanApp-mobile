import { describe, expect, it } from 'vitest';
import { formatDateJa, parseDateKey } from './date';

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

  it('うるう日を扱える', () => {
    expect(formatDateJa('2024-02-29')).toBe('2月29日（木）');
  });
});

describe('parseDateKey', () => {
  it('date key をローカルタイムで解釈する（UTC へずれない）', () => {
    const date = parseDateKey('2026-01-05');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(5);
  });

  it('DST の切り替えをまたぐ日でも日付が動かない（正午起点）', () => {
    // 多くの地域で DST の切り替えは深夜に起きる。正午起点なので影響を受けない
    for (const key of ['2026-03-08', '2026-11-01', '2026-03-29', '2026-10-25']) {
      const date = parseDateKey(key);
      const [, , day] = key.split('-').map(Number);
      expect(date.getDate()).toBe(day);
    }
  });

  it('月末・年末の date key を取り違えない', () => {
    expect(parseDateKey('2026-12-31').getMonth()).toBe(11);
    expect(parseDateKey('2026-12-31').getDate()).toBe(31);
    expect(parseDateKey('2026-01-01').getMonth()).toBe(0);
    expect(parseDateKey('2026-01-01').getDate()).toBe(1);
  });
});
