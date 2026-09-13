const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土'] as const;

/** 1日のミリ秒。週計算のオフセット用。 */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

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

/** Date を 'YYYY-MM-DD'（ローカルタイム基準）へ。`toISOString()` と違い UTC へずれない。 */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** 今日の date key。 */
export function todayKey(): string {
  return toDateKey(new Date());
}

/** date key に日数を加減した date key を返す（月/年またぎも Date に任せる）。 */
export function addDays(dateString: string, days: number): string {
  const date = parseDateKey(dateString);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

/**
 * その日を含む週の**日曜日**の date key を返す。
 * （カレンダー画面の react-native-calendars が日曜始まりなので表示を揃える）
 */
export function startOfWeek(dateString: string): string {
  const date = parseDateKey(dateString);
  return toDateKey(new Date(date.getTime() - date.getDay() * MS_PER_DAY));
}

/** 週の起点（日曜）から7日分の date key を並べる。週別ビューの列そのもの。 */
export function buildWeekDates(weekStart: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

/**
 * 'YYYY-MM-DD' を「M月D日（曜）」表記へ変換する純粋関数。
 * これまで CalendarScreen と DayScheduleList に重複実装されていたものを一本化。
 * （重複＝片方だけ直してデグレ、の温床だった）
 */
export function formatDateJa(dateString: string): string {
  const date = parseDateKey(dateString);
  return `${date.getMonth() + 1}月${date.getDate()}日（${WEEKDAYS_JA[date.getDay()]}）`;
}

/** 曜日1文字（'日'〜'土'）。週別ビューの列ヘッダ用。 */
export function formatWeekdayJa(dateString: string): string {
  return WEEKDAYS_JA[parseDateKey(dateString).getDay()] ?? '';
}

/** 'M/D'。列ヘッダなど幅の限られた場所用。 */
export function formatMonthDay(dateString: string): string {
  const date = parseDateKey(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/** 「1月4日 〜 1月10日」。週別ビューのタイトル用。 */
export function formatWeekRangeJa(weekStart: string): string {
  const end = addDays(weekStart, 6);
  const start = parseDateKey(weekStart);
  const last = parseDateKey(end);
  return `${start.getMonth() + 1}月${start.getDate()}日 〜 ${last.getMonth() + 1}月${last.getDate()}日`;
}
