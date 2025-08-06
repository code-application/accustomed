"use client";

import { Task } from "@/types";
import { TaskCard } from "./task-card";
import { Alert, AlertDescription } from "./ui/alert";

/**
 * タスク一覧コンポーネントのプロパティ
 * @interface TaskListProps
 * @property {Task[]} tasks - タスクの配列
 * @property {Function} onToggle - タスクの完了状態を切り替える関数
 * @property {Function} onDelete - タスクを削除する関数
 * @property {Function} onEdit - タスクを編集する関数
 */
interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

/**
 * タスク一覧コンポーネント
 * @param {TaskListProps} props - タスク一覧のプロパティ
 * @param {Task[]} props.tasks - タスクの配列
 * @param {Function} props.onToggle - タスクの完了状態を切り替える関数
 * @param {Function} props.onDelete - タスクを削除する関数
 * @param {Function} props.onEdit - タスクを編集する関数
 */
export function TaskList({ tasks, onToggle, onDelete, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Alert>
        <AlertDescription className="text-center">
          習慣がまだありません。「＋」ボタンをクリックして最初の習慣を作成してください。
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">習慣一覧</h2>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.configuration.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}
