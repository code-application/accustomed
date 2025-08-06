"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types";
import { loadTasks, saveTasks } from "@/lib/localStorage";
import {
  createTaskInstance,
  toggleTaskInstanceCompletionById,
  isSameDate,
} from "@/lib/taskUtils";

/**
 * タスクを管理するフック
 * @returns タスクの一覧、読み込み状態、タスクの追加、更新、削除、完了状態の切り替え
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
    setIsLoading(false);
  }, []);

  /**
   * タスクを追加する
   * @param {Task} task - 追加するタスク
   */
  const addTask = (task: Task) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  /**
   * タスクを更新する
   * @param {string} taskId - 更新するタスクのID
   * @param {Partial<Task>} updates - 更新するタスクの内容
   */
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const newTasks = tasks.map((task) =>
      task.configuration.id === taskId ? { ...task, ...updates } : task
    );
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  /**
   * タスクを削除する
   * @param {string} taskId - 削除するタスクのID
   */
  const deleteTask = (taskId: string) => {
    const newTasks = tasks.filter((task) => task.configuration.id !== taskId);
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  /**
   * タスクの完了状態を切り替える
   * @param {string} taskId - 切り替えるタスクのID
   */
  const toggleTask = (taskId: string) => {
    const task = tasks.find((t) => t.configuration.id === taskId);
    if (task) {
      const today = new Date();
      const todayInstance = task.instances.find((instance) =>
        isSameDate(instance.scheduledDate, today)
      );

      if (todayInstance) {
        // 今日のインスタンスが存在する場合は完了状態を切り替え
        const updatedTask = toggleTaskInstanceCompletionById(
          task,
          todayInstance.id
        );
        const newTasks = tasks.map((t) =>
          t.configuration.id === taskId ? updatedTask : t
        );
        setTasks(newTasks);
        saveTasks(newTasks);
      } else {
        // 今日のインスタンスが存在しない場合は新しく作成して完了状態にする
        const newInstance = {
          ...createTaskInstance(task.configuration.id, today),
          status: "done" as const,
          completedDate: new Date(),
        };
        const updatedTask = {
          ...task,
          instances: [...task.instances, newInstance],
        };
        const newTasks = tasks.map((t) =>
          t.configuration.id === taskId ? updatedTask : t
        );
        setTasks(newTasks);
        saveTasks(newTasks);
      }
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
