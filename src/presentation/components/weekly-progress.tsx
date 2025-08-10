"use client";

import { useEffect } from "react";
import { Task } from "@/domain/Task";
import { formatWeeklyData } from "@/domain/TaskDomainService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { DateGrid, DayData } from "./date-grid";
import { getWeekStart, isCurrentWeek } from "@/shared/DateUtils";

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

  /**
   * 今週の開始日の文字列
   */
  const currentWeekStartDateString = `${
    currentWeekStart.getMonth() + 1
  }/${currentWeekStart.getDate()}`;

  /**
   * 今週の終了日の文字列
   */
  const currentWeekEndDateString = `${
    new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).getMonth() +
    1
  }/${new Date(
    currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000
  ).getDate()}`;

  // デバッグ用：タスクの状態を確認
  console.log("WeeklyProgress - Task instances:", task.instances);
  console.log("WeeklyProgress - Weekly data:", weeklyData);

  // タスクの状態が変更されたときにweeklyDataを再計算
  useEffect(() => {
    // このuseEffectはtaskが変更されたときに実行される
    console.log("WeeklyProgress - Task updated:", task);
  }, [task]);

  const weekDayLabels = ["日", "月", "火", "水", "木", "金", "土"];

  /**
   * 日付ボックスをクリックしたときの処理
   * タスクの完了状態を切り替える
   * @param dayData - 日付データ
   */
  const handleDayClick = (dayData: DayData): void => {
    if (dayData.isToday) {
      onToggle(task.configuration.id);
    }
  };

  /**
   * 週別表示用の日付フォーマット関数
   * @param date - 日付
   * @returns フォーマットされた日付文字列
   */
  const formatWeeklyDate = (date: Date): string => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  /**
   * 週別表示用のクリック可能判定関数
   * @param dayData - 日付データ
   * @returns クリック可能かどうか
   */
  const isWeeklyClickable = (dayData: DayData): boolean => {
    return dayData.isToday === true;
  };

  /**
   * 週別表示用のスタイル関数
   * @param dayData - 日付データ
   * @returns スタイルクラス名
   */
  const getWeeklyDayStyle = (dayData: DayData): string => {
    if (dayData.isCompleted) {
      return "text-green-700";
    }
    if (dayData.isToday) {
      return "bg-blue-100 text-blue-600 hover:bg-blue-200";
    }
    return "text-gray-400";
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

  return (
    <div className="space-y-3">
      {/* 週のナビゲーション */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousWeek}
          className="text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          先週
        </Button>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {currentWeekStartDateString} - {currentWeekEndDateString}
          </span>
          {isCurrentWeek() && (
            <button
              onClick={goToCurrentWeek}
              className="text-blue-600 hover:text-blue-700 text-xs"
            >
              今週
            </button>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextWeek}
          className="text-gray-500 hover:text-gray-700"
        >
          翌週
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* 週間グリッド */}
      <DateGrid
        weekDayLabels={weekDayLabels}
        days={weeklyData.days}
        onDayClick={handleDayClick}
        formatDate={formatWeeklyDate}
        showCompletionIcon={true}
        isClickable={isWeeklyClickable}
        getDayStyle={getWeeklyDayStyle}
      />

      {/* 完了統計 */}
      <div className="text-center text-sm text-gray-600">
        今週の完了: {weeklyData.totalCompletions}/7
      </div>
    </div>
  );
}
