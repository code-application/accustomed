import { format, isToday, parseISO, differenceInDays, startOfDay } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function isDateToday(dateString: string): boolean {
  try {
    return isToday(parseISO(dateString));
  } catch {
    return false;
  }
}

export function getCurrentDateString(): string {
  return formatDate(new Date());
}

export function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  
  const sortedDates = completedDates
    .map(date => parseISO(date))
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

export function getWeeklyProgress(completedDates: string[]): number[] {
  const today = new Date();
  const weeklyData: number[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = formatDate(date);
    
    const completions = completedDates.filter(d => d === dateString).length;
    weeklyData.push(completions);
  }
  
  return weeklyData;
}