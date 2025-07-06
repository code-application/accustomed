'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { loadTasks, saveTasks } from '@/lib/localStorage';
import { toggleTaskCompletion } from '@/lib/taskUtils';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
    setIsLoading(false);
  }, []);

  const addTask = (task: Task) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const newTasks = tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const deleteTask = (taskId: string) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const toggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = toggleTaskCompletion(task);
      updateTask(taskId, updatedTask);
    }
  };

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
}