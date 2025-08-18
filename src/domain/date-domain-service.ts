import { parseISO, differenceInDays, startOfDay } from "date-fns";
import { formatDate } from "../shared/date-utils";

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
 * 今週かどうかを判定する
 */
export function isCurrentWeek(): boolean {
  const today = new Date();
  const todayWeekStart = getWeekStart(today);
  const currentWeekStart = getWeekStart(new Date());
  return isSameDate(currentWeekStart, todayWeekStart);
}

/**
 * 週の開始日（日曜日）を取得
 * @param date 基準日
 * @returns その週の日曜日の日付
 */
function getWeekStart(date: Date): Date {
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
function isSameDate(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
