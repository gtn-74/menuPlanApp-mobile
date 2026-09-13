import { describe, expect, it } from 'vitest';
import {
  addDays,
  buildWeekDates,
  formatDateJa,
  formatMonthDay,
  formatWeekRangeJa,
  formatWeekdayJa,
  parseDateKey,
  startOfWeek,
  toDateKey,
} from './date';

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

describe('parseDateKey / toDateKey', () => {
  it('date key をローカルタイムで解釈する（UTC へずれない）', () => {
    const date = parseDateKey('2026-01-05');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(5);
  });

  it('toDateKey は parseDateKey の逆変換になる（往復して元に戻る）', () => {
    for (const key of ['2026-01-05', '2026-12-31', '2024-02-29']) {
      expect(toDateKey(parseDateKey(key))).toBe(key);
    }
  });

  it('1桁の月日をゼロ埋めする', () => {
    expect(toDateKey(new Date(2026, 0, 5, 12))).toBe('2026-01-05');
  });
});

describe('addDays', () => {
  it('日を加算する', () => {
    expect(addDays('2026-01-05', 3)).toBe('2026-01-08');
  });

  it('日を減算する', () => {
    expect(addDays('2026-01-05', -3)).toBe('2026-01-02');
  });

  it('月またぎ・年またぎを正しく扱う', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('うるう年の 2/29 を飛ばさない', () => {
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDays('2025-02-28', 1)).toBe('2025-03-01');
  });
});

describe('startOfWeek', () => {
  it('週の起点として日曜を返す', () => {
    // 2026-01-05(月) 〜 2026-01-10(土) はいずれも 2026-01-04(日) 始まりの週
    expect(startOfWeek('2026-01-05')).toBe('2026-01-04');
    expect(startOfWeek('2026-01-10')).toBe('2026-01-04');
  });

  it('日曜自身を渡したらその日を返す（冪等）', () => {
    expect(startOfWeek('2026-01-04')).toBe('2026-01-04');
    expect(startOfWeek(startOfWeek('2026-01-07'))).toBe('2026-01-04');
  });

  it('月をまたぐ週も正しく遡る', () => {
    // 2026-02-01 は日曜、2026-03-03(火) の週頭は 2026-03-01(日)
    expect(startOfWeek('2026-02-01')).toBe('2026-02-01');
    expect(startOfWeek('2026-03-03')).toBe('2026-03-01');
  });
});

describe('buildWeekDates', () => {
  it('週頭から7日分を連続して並べる', () => {
    expect(buildWeekDates('2026-01-04')).toEqual([
      '2026-01-04',
      '2026-01-05',
      '2026-01-06',
      '2026-01-07',
      '2026-01-08',
      '2026-01-09',
      '2026-01-10',
    ]);
  });

  it('月をまたぐ週も途切れない', () => {
    expect(buildWeekDates('2026-01-25')).toEqual([
      '2026-01-25',
      '2026-01-26',
      '2026-01-27',
      '2026-01-28',
      '2026-01-29',
      '2026-01-30',
      '2026-01-31',
    ]);
    expect(buildWeekDates('2026-03-29')[6]).toBe('2026-04-04');
  });
});

describe('表示用フォーマッタ', () => {
  it('formatWeekdayJa は曜日1文字を返す', () => {
    expect(formatWeekdayJa('2026-01-04')).toBe('日');
    expect(formatWeekdayJa('2026-01-10')).toBe('土');
  });

  it('formatMonthDay は M/D を返す（ゼロ埋めしない）', () => {
    expect(formatMonthDay('2026-01-05')).toBe('1/5');
    expect(formatMonthDay('2026-12-25')).toBe('12/25');
  });

  it('formatWeekRangeJa は週の開始日と終了日を並べる', () => {
    expect(formatWeekRangeJa('2026-01-04')).toBe('1月4日 〜 1月10日');
    expect(formatWeekRangeJa('2026-01-25')).toBe('1月25日 〜 1月31日');
  });
});
