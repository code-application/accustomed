'use client';

import { Task } from '@/types';
import { TaskCard } from './task-card';
import { Alert, AlertDescription } from './ui/alert';

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

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
            key={task.id}
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