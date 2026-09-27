const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土'] as const;

/**
 * 'YYYY-MM-DD'（date key）を**ローカルタイムの正午**の Date として解釈する。
 *
 * `new Date('2026-01-05')` は ISO 日付として **UTC 深夜**にパースされるため、
 * UTC より西のタイムゾーンでは getDate() が前日を返してしまう。
 * また深夜起点だと DST のある地域で ±1h の加算が日付をまたぐ。
 * 正午を起点にすることでどちらも避ける（日本時間では従来と同じ結果）。
 */
export function parseDateKey(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1, 12);
}

/**
 * 'YYYY-MM-DD' を「M月D日（曜）」表記へ変換する純粋関数。
 * これまで CalendarScreen と DayScheduleList に重複実装されていたものを一本化。
 * （重複＝片方だけ直してデグレ、の温床だった）
 */
export function formatDateJa(dateString: string): string {
  const date = parseDateKey(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS_JA[date.getDay()];
  return `${month}月${day}日（${weekday}）`;
}
