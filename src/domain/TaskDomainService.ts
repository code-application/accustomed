import {
  Task,
  TaskConfiguration,
  TaskInstance,
  TaskStats,
  WeeklyData,
  WeeklyDayData,
  MonthlyHistoryData,
  DayData,
} from "./Task";
import { isDateToday, getDaysInMonth } from "@/shared/DateUtils";
import { calculateStreak } from "./DateDomainService";

/**
 * タスク設定のIDを生成する
 * @returns タスク設定のID
 */
export function generateTaskConfigurationId(): string {
  return `task-config-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * タスクインスタンスのIDを生成する
 * @returns タスクインスタンスのID
 */
export function generateTaskInstanceId(): string {
  return `task-instance-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
}

/**
 * タスクインスタンスを生成する
 * @param taskConfiguration タスク設定
 * @returns タスクインスタンス
 */
export function generateTaskInstance(
  taskConfiguration: TaskConfiguration
): TaskInstance {
  return {
    id: generateTaskInstanceId(),
    configurationId: taskConfiguration.id,
    status: "not-started",
    scheduledDate: new Date(),
    createdAt: new Date(),
  };
}

/**
 * タスクインスタンスが今日完了しているかどうかを判定する
 * @param taskInstance タスクインスタンス
 * @returns タスクインスタンスが今日完了しているかどうか
 */
export function isTaskInstanceCompletedToday(
  taskInstance: TaskInstance
): boolean {
  if (!taskInstance.completedDate) {
    return false;
  }
  const completedDate =
    taskInstance.completedDate instanceof Date
      ? taskInstance.completedDate
      : new Date(taskInstance.completedDate);
  return isDateToday(completedDate.toISOString());
}

/**
 * 日付を安全に比較する関数
 * @param date1 日付1
 * @param date2 日付2
 * @returns 同じ日付かどうか
 */
export function isSameDate(
  date1: Date | string,
  date2: Date | string
): boolean {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);
  return d1.toDateString() === d2.toDateString();
}

/**
 * タスクインスタンスの完了状態を切り替える
 * @param taskInstance タスクインスタンス
 * @returns 切り替え後のタスクインスタンス
 */
export function toggleTaskInstanceCompletion(
  taskInstance: TaskInstance
): TaskInstance {
  if (taskInstance.status === "done") {
    return {
      ...taskInstance,
      status: "not-started",
      completedDate: undefined,
    };
  }
  return {
    ...taskInstance,
    status: "done",
    completedDate: new Date(),
  };
}

/**
 * 指定された日付でタスクインスタンスを作成する
 * @param configurationId タスク設定のID
 * @param scheduledDate 予定日
 * @returns 新しいタスクインスタンス
 */
export function createTaskInstance(
  configurationId: string,
  scheduledDate: Date
): TaskInstance {
  return {
    id: generateTaskInstanceId(),
    configurationId,
    status: "not-started",
    scheduledDate,
    createdAt: new Date(),
  };
}

/**
 * タスク全体のインスタンス完了状態を切り替える
 * @param task タスク
 * @param instanceId インスタンスID
 * @returns 更新されたタスク
 */
export function toggleTaskInstanceCompletionById(
  task: Task,
  instanceId: string
): Task {
  const updatedInstances = task.instances.map((instance) =>
    instance.id === instanceId
      ? toggleTaskInstanceCompletion(instance)
      : instance
  );

  return {
    ...task,
    instances: updatedInstances,
  };
}

/**
 * 新しいTask用の統計計算
 * @param tasks タスク配列
 * @returns タスク統計
 */
export function calculateNewTaskStats(tasks: Task[]): TaskStats {
  const totalTasks = tasks.length;
  const today = new Date();

  const completedToday = tasks.filter((task) =>
    task.instances.some(
      (instance) =>
        instance.scheduledDate.toDateString() === today.toDateString() &&
        instance.status === "done"
    )
  ).length;

  const totalCompletions = tasks.reduce(
    (sum, task) =>
      sum +
      task.instances.filter((instance) => instance.status === "done").length,
    0
  );

  // 連続記録の計算（最も長い連続記録を取得）
  const currentStreak =
    tasks.length > 0
      ? Math.max(
          ...tasks.map((task) => {
            const completedDates = task.instances
              .filter(
                (instance) =>
                  instance.status === "done" && instance.completedDate
              )
              .map(
                (instance) =>
                  instance.completedDate!.toISOString().split("T")[0]
              )
              .sort();
            return calculateStreak(completedDates);
          })
        )
      : 0;

  const completionRate =
    totalTasks > 0 ? (completedToday / totalTasks) * 100 : 0;

  return {
    totalTasks,
    completedToday,
    currentStreak,
    totalCompletions,
    completionRate,
  };
}

/**
 * 指定された週のインスタンスを取得
 * @param task タスク
 * @param startDate 週の開始日（日曜日）
 * @returns その週のインスタンス配列
 */
export function getWeeklyInstances(
  task: Task,
  startDate: Date
): TaskInstance[] {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6); // 土曜日まで

  return task.instances.filter((instance) => {
    const scheduledDate =
      instance.scheduledDate instanceof Date
        ? instance.scheduledDate
        : new Date(instance.scheduledDate);

    return scheduledDate >= startDate && scheduledDate <= endDate;
  });
}

/**
 * 指定された月のインスタンスを取得
 * @param task タスク
 * @param year 年
 * @param month 月（0-11）
 * @returns その月のインスタンス配列
 */
export function getMonthlyInstances(
  task: Task,
  year: number,
  month: number
): TaskInstance[] {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0); // 月末

  return task.instances.filter((instance) => {
    const scheduledDate =
      instance.scheduledDate instanceof Date
        ? instance.scheduledDate
        : new Date(instance.scheduledDate);

    return scheduledDate >= startDate && scheduledDate <= endDate;
  });
}

/**
 * 残り日数を計算
 * @param task タスク
 * @returns 残り日数
 */
export function calculateRemainingDays(task: Task): number {
  const today = new Date();
  const deadline = task.configuration.duration.deadline;

  const remaining = Math.ceil(
    (deadline.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
  );
  return Math.max(0, remaining);
}

/**
 * 月別履歴データを整形
 * @param task タスク
 * @param year 年
 * @param month 月（0-11）
 * @returns 月別履歴データ
 */
export function formatMonthlyHistoryData(
  task: Task,
  year: number,
  month: number
): MonthlyHistoryData {
  const instances = getMonthlyInstances(task, year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const days: DayData[] = [];
  const today = new Date();

  // 月の最初の日の曜日を取得（0=日曜日）
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // 前月の日付を追加
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(prevYear, prevMonth, day);
    days.push({
      date,
      isCompleted: false,
      isCurrentMonth: false,
      isToday: isSameDate(date, today),
    });
  }

  // 現在の月の日付を追加
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const instance = instances.find((inst) => {
      const scheduledDate =
        inst.scheduledDate instanceof Date
          ? inst.scheduledDate
          : new Date(inst.scheduledDate);
      return isSameDate(scheduledDate, date);
    });

    days.push({
      date,
      isCompleted: instance?.status === "done",
      completionCount: instance?.status === "done" ? 1 : 0,
      isCurrentMonth: true,
      isToday: isSameDate(date, today),
    });
  }

  // 翌月の日付を追加（週の終わりまで）
  const lastDayOfMonth = new Date(year, month, daysInMonth).getDay();
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  for (let day = 1; day <= 6 - lastDayOfMonth; day++) {
    const date = new Date(nextYear, nextMonth, day);
    days.push({
      date,
      isCompleted: false,
      isCurrentMonth: false,
      isToday: isSameDate(date, today),
    });
  }

  return {
    year,
    month,
    days,
    totalCompletions: instances.filter((inst) => inst.status === "done").length,
  };
}

/**
 * 週間データを整形
 * @param task タスク
 * @param startDate 週の開始日
 * @returns 週間データ
 */
export function formatWeeklyData(task: Task, startDate: Date): WeeklyData {
  const instances = getWeeklyInstances(task, startDate);
  const days: WeeklyDayData[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const instance = instances.find((inst) => {
      const scheduledDate =
        inst.scheduledDate instanceof Date
          ? inst.scheduledDate
          : new Date(inst.scheduledDate);
      return isSameDate(scheduledDate, date);
    });

    days.push({
      date,
      isCompleted: instance?.status === "done",
      isToday: isSameDate(date, new Date()),
    });
  }

  return {
    startDate,
    days,
    totalCompletions: instances.filter((inst) => inst.status === "done").length,
  };
}
