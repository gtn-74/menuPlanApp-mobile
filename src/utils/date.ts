const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土'] as const;

/**
 * 'YYYY-MM-DD' を「M月D日（曜）」表記へ変換する純粋関数。
 * これまで CalendarScreen と DayScheduleList に重複実装されていたものを一本化。
 * （重複＝片方だけ直してデグレ、の温床だった）
 */
export function formatDateJa(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS_JA[date.getDay()];
  return `${month}月${day}日（${weekday}）`;
}
