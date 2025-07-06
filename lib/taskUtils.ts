import { Task, TaskStats } from '@/types';
import { getCurrentDateString, isDateToday, calculateStreak } from './dateUtils';

export function generateTaskId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function isTaskCompletedToday(task: Task): boolean {
  const today = getCurrentDateString();
  return task.completedDates.includes(today);
}

export function toggleTaskCompletion(task: Task): Task {
  const today = getCurrentDateString();
  const isCompleted = task.completedDates.includes(today);
  
  let newCompletedDates: string[];
  let newStatus: Task['status'];
  
  if (isCompleted) {
    newCompletedDates = task.completedDates.filter(date => date !== today);
    newStatus = newCompletedDates.length > 0 ? 'in-progress' : 'not-started';
  } else {
    newCompletedDates = [...task.completedDates, today];
    newStatus = 'in-progress';
  }
  
  return {
    ...task,
    completedDates: newCompletedDates,
    status: newStatus,
  };
}

export function calculateTaskStats(tasks: Task[]): TaskStats {
  const totalTasks = tasks.length;
  const completedToday = tasks.filter(isTaskCompletedToday).length;
  const totalCompletions = tasks.reduce((sum, task) => sum + task.completedDates.length, 0);
  
  const currentStreak = tasks.length > 0 
    ? Math.max(...tasks.map(task => calculateStreak(task.completedDates)))
    : 0;
  
  const completionRate = totalTasks > 0 ? (completedToday / totalTasks) * 100 : 0;
  
  return {
    totalTasks,
    completedToday,
    currentStreak,
    totalCompletions,
    completionRate,
  };
}