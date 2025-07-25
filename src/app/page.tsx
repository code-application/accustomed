'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import { TaskList } from '@/components/task-list';
import { AddTaskModal } from '@/components/add-task-modal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Target } from 'lucide-react';

export default function Home() {
  const { tasks, isLoading, addTask, updateTask, deleteTask, toggleTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleAddTask = (task: Task) => {
    if (editingTask) {
      updateTask(task.id, task);
      setEditingTask(undefined);
    } else {
      addTask(task);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                <Target className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">習慣トラッカー</h1>
              <p className="text-muted-foreground">毎日の習慣を記録して、目標を達成しましょう</p>
            </div>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            習慣を追加
          </Button>
        </div>


        {/* Task List */}
        <div>
          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={handleEditTask}
          />
        </div>

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleAddTask}
          editingTask={editingTask}
        />
      </div>
    </div>
  );
}