import { Task, TaskConfiguration, TaskInstance, TaskStats } from "@/types";
import { isDateToday, calculateStreak } from "./dateUtils";

// Task用のユーティリティ関数群
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
