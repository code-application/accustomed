import {
  format,
  isToday,
  parseISO,
  startOfDay,
} from "date-fns";

/**
 * 日付をYYYY-MM-DD形式の文字列に変換する関数
 * @param date - 変換する日付
 * @returns 変換後の日付文字列
 */
export function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * 日付文字列が今日の日付かどうかを判定する関数
 * @param dateString - 日付文字列
 * @returns 今日の日付かどうか
 */
export function isDateToday(dateString: string): boolean {
  try {
    return isToday(parseISO(dateString));
  } catch {
    return false;
  }
}

/**
 * 今日の日付をYYYY-MM-DD形式の文字列で取得する関数
 * @returns 今日の日付文字列
 */
export function getCurrentDateString(): string {
  return formatDate(new Date());
}

/**
 * 月の日数を取得
 * @param year 年
 * @param month 月（0-11）
 * @returns その月の日数
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 週の開始日（日曜日）を取得
 * @param date 基準日
 * @returns その週の日曜日の日付
 */
export function getWeekStart(date: Date): Date {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - day);
  return weekStart;
}

/**
 * 2つの日付が同じ日付かどうかを判定する関数
 * @param d1 - 日付1
 * @param d2 - 日付2
 * @returns 同じ年月日かどうか
 */
export function isSameDate(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * 今月かどうかを判定する関数
 * @param year - 年
 * @param month - 月
 * @returns 今月かどうか
 */
export function isCurrentMonth(year: number, month: number): boolean {
  const today = new Date();
  return today.getFullYear() === year && today.getMonth() === month;
}

/**
 * 月の名前を取得する関数
 * @param year - 年
 * @param month - 月
 * @returns 月の名前
 */
export function getMonthName(year: number, month: number): string {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString("ja-JP", { year: "numeric", month: "long" });
}

/**
 * 今月の末日を取得する関数
 * @returns 今月の末日の日付文字列（YYYY/MM/DD形式）
 */
export function getEndOfMonthExample(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // 今月の末日を取得
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // YYYY/MM/DD形式で返す
  const yearStr = lastDayOfMonth.getFullYear();
  const monthStr = String(lastDayOfMonth.getMonth() + 1).padStart(2, "0");
  const dayStr = String(lastDayOfMonth.getDate()).padStart(2, "0");

  return `${yearStr}/${monthStr}/${dayStr}`;
}

/**
 * 今週かどうかを判定する
 */
export function isCurrentWeek(): boolean {
  const today = new Date();
  const todayWeekStart = getWeekStart(today);
  const currentWeekStart = getWeekStart(new Date());
  return isSameDate(currentWeekStart, todayWeekStart);
}