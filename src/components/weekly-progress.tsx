"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types";
import { formatWeeklyData, getWeekStart } from "@/lib/taskUtils";
import { Check } from "lucide-react";

/**
 * 週の進捗を表示するコンポーネントのprops
 * @param task - タスク
 * @param onToggle - タスクの完了状態を切り替える関数
 */
interface WeeklyProgressProps {
  task: Task;
  onToggle: (taskId: string) => void;
}

/**
 * 週の進捗を表示するコンポーネント
 * @param task - タスク
 * @param onToggle - タスクの完了状態を切り替える関数
 */
export function WeeklyProgress({ task, onToggle }: WeeklyProgressProps) {
  // 常に今週の開始日を使用
  const currentWeekStart = getWeekStart(new Date());

  const weeklyData = formatWeeklyData(task, currentWeekStart);

  // デバッグ用：タスクの状態を確認
  console.log("WeeklyProgress - Task instances:", task.instances);
  console.log("WeeklyProgress - Weekly data:", weeklyData);

  // タスクの状態が変更されたときにweeklyDataを再計算
  useEffect(() => {
    // このuseEffectはtaskが変更されたときに実行される
    console.log("WeeklyProgress - Task updated:", task);
  }, [task]);

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  /**
   * 日付ボックスをクリックしたときの処理
   * @param dayData - 日付データ
   */
  const handleDayClick = (dayData: any) => {
    if (dayData.isToday) {
      onToggle(task.configuration.id);
    }
  };

  /**
   * 前の週に移動する
   */
  const goToPreviousWeek = () => {
    // 週の移動機能は無効化（常に今週を表示）
  };

  /**
   * 次の週に移動する
   */
  const goToNextWeek = () => {
    // 週の移動機能は無効化（常に今週を表示）
  };

  /**
   * 今週に移動する
   */
  const goToCurrentWeek = () => {
    // 常に今週を表示しているため何もしない
  };

  /**
   * 今週かどうかを判定する
   */
  const isCurrentWeek = () => {
    const today = new Date();
    const todayWeekStart = getWeekStart(today);
    return currentWeekStart.getTime() === todayWeekStart.getTime();
  };

  return (
    <div className="space-y-3">
      {/* 週のナビゲーション */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousWeek}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ＜先週
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {currentWeekStart.getMonth() + 1}/{currentWeekStart.getDate()} -{" "}
            {new Date(
              currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000
            ).getMonth() + 1}
            /
            {new Date(
              currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000
            ).getDate()}
          </span>
          {!isCurrentWeek() && (
            <button
              onClick={goToCurrentWeek}
              className="text-blue-600 hover:text-blue-700 text-xs"
            >
              今週
            </button>
          )}
        </div>

        <button
          onClick={goToNextWeek}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          翌週＞
        </button>
      </div>

      {/* 週間グリッド */}
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-sm overflow-hidden">
        {/* 曜日ラベル */}
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="text-center p-1 bg-gray-50 border-r border-gray-200 last:border-r-0"
          >
            <div className="text-xs text-gray-500">{day}</div>
          </div>
        ))}

        {/* 日付ボックス */}
        {weeklyData.days.map((dayData, index) => (
          <div
            key={index}
            className={`
              text-center p-1 border-r border-gray-200 last:border-r-0 border-t border-gray-200 aspect-square
              ${dayData.isCompleted ? "bg-green-100 border-green-300" : ""}
            `}
          >
            <button
              onClick={() => handleDayClick(dayData)}
              disabled={!dayData.isToday}
              className={`
                w-full h-full flex items-center justify-center text-xs font-medium
                transition-colors duration-200
                ${
                  dayData.isCompleted
                    ? "text-green-700"
                    : dayData.isToday
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    : "text-gray-400"
                }
                ${!dayData.isToday ? "cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {dayData.isCompleted ? (
                <div className="flex items-center space-x-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span className="text-xs">
                    {dayData.date.getMonth() + 1}/{dayData.date.getDate()}
                  </span>
                </div>
              ) : (
                `${dayData.date.getMonth() + 1}/${dayData.date.getDate()}`
              )}
            </button>
          </div>
        ))}
      </div>

      {/* 完了統計 */}
      <div className="text-center text-sm text-gray-600">
        今週の完了: {weeklyData.totalCompletions}/7
      </div>
    </div>
  );
}
