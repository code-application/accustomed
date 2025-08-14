import { Task } from "@/domain/Task";

const STORAGE_KEY = "habit-tracker-tasks";

/**
 * タスクを保存する
 * @param {Task[]} tasks - 保存するタスクの一覧
 */
export function saveTasks(tasks: Task[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}
/**
 * タスクを読み込む
 * @returns {Task[]} タスクの一覧
 */
export function loadTasks(): Task[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Dateオブジェクトを復元
        return parsed.map((task: any) => ({
          ...task,
          configuration: {
            ...task.configuration,
            createdAt: new Date(task.configuration.createdAt),
            duration: {
              ...task.configuration.duration,
              deadline: new Date(task.configuration.duration.deadline),
              startedAt: new Date(task.configuration.duration.startedAt),
            },
          },
          instances: task.instances.map((instance: any) => ({
            ...instance,
            scheduledDate: new Date(instance.scheduledDate),
            completedDate: instance.completedDate
              ? new Date(instance.completedDate)
              : undefined,
            createdAt: new Date(instance.createdAt),
          })),
        }));
      } catch (error) {
        console.error("Error parsing stored tasks:", error);
        return [];
      }
    }
  }
  return [];
}

/**
 * タスクをクリアする
 */
export function clearTasks(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
