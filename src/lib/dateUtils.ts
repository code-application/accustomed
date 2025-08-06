import {
  format,
  isToday,
  parseISO,
  differenceInDays,
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
 * 連続日数を計算する関数
 * @param completedDates - 完了した日付の配列
 * @returns 連続日数
 */
export function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  const sortedDates = completedDates
    .map((date) => parseISO(date))
    .sort((a, b) => b.getTime() - a.getTime()); // descending order

  let streak = 0;
  let currentDate = startOfDay(new Date());

  for (const completedDate of sortedDates) {
    const daysDiff = differenceInDays(currentDate, startOfDay(completedDate));

    if (daysDiff === streak) {
      streak++;
    } else if (daysDiff === streak + 1 && streak === 0) {
      // Allow for yesterday if today isn't completed yet
      streak++;
    } else {
      break;
    }

    currentDate = startOfDay(completedDate);
  }

  return streak;
}

/**
 * 週別の進捗を計算する関数
 * @param completedDates - 完了した日付の配列
 * @returns 週別の進捗
 */
export function getWeeklyProgress(completedDates: string[]): number[] {
  const today = new Date();
  const weeklyData: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = formatDate(date);

    const completions = completedDates.filter((d) => d === dateString).length;
    weeklyData.push(completions);
  }

  return weeklyData;
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

  // YYYY/MMDD形式で返す
  const yearStr = lastDayOfMonth.getFullYear();
  const monthStr = String(lastDayOfMonth.getMonth() + 1).padStart(2, "0");
  const dayStr = String(lastDayOfMonth.getDate()).padStart(2, "0");

  return `${yearStr}/${monthStr}/${dayStr}`;
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
 * 今週かどうかを判定する
 */
export const isCurrentWeek = (): boolean => {
  const today = new Date();
  const todayWeekStart = getWeekStart(today);
  const currentWeekStart = getWeekStart(new Date());
  return isSameDate(currentWeekStart, todayWeekStart);
};

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
 * 月の名前を取得する関数
 * @param year - 年
 * @param month - 月
 * @returns 月の名前
 */
export function getMonthName(year: number, month: number): string {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString("ja-JP", { year: "numeric", month: "long" });
}
