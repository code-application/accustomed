/**
 * タスク設定
 * タスクの設定を管理するためのインターフェース
 * タスクの共通の設定内容を管理する
 */
export interface TaskConfiguration {
  id: string;
  content: string;
  frequency: TaskFrequency;
  duration: TaskDuration;
  createdAt: Date;
}

/**
 * タスクインスタンス
 * タスクのインスタンスを管理するためのインターフェース
 * タスクのインスタンスは、タスクの設定に基づいて作成される
 */
export interface TaskInstance {
  id: string;
  configurationId: string;
  status: TaskStatus;
  scheduledDate: Date;
  completedDate?: Date;
  createdAt: Date;
}

/**
 * タスク
 * タスクの設定とインスタンスを管理するためのインターフェース
 */
export interface Task {
  configuration: TaskConfiguration;
  instances: TaskInstance[];
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

export type TaskStatus = "not-started" | "in-progress" | "done";
export type FrequencyUnit = "day" | "week" | "month" | "year";
export type DurationUnit = "day" | "week" | "month" | "year";

export interface TaskStats {
  totalTasks: number;
  completedToday: number;
  currentStreak: number;
  totalCompletions: number;
  completionRate: number;
}
