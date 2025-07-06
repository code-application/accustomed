export interface Task {
  id: string;
  content: string;
  status: TaskStatus;
  frequency: TaskFrequency;
  duration: TaskDuration;
  createdAt: Date;
  completedDates: string[]; // YYYY-MM-DD format
}

export interface TaskFrequency {
  unit: FrequencyUnit;
  count: number;
}

export interface TaskDuration {
  startedAt: Date;
  unit: DurationUnit;
  length: number;
}

export type TaskStatus = 'not-started' | 'in-progress' | 'done';
export type FrequencyUnit = 'day' | 'week' | 'month' | 'year';
export type DurationUnit = 'day' | 'week' | 'month' | 'year';

export interface TaskStats {
  totalTasks: number;
  completedToday: number;
  currentStreak: number;
  totalCompletions: number;
  completionRate: number;
}