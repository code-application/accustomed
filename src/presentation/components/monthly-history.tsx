"use client";

import { useState } from "react";
import { Task } from "@/domain/Task";
import { formatMonthlyHistoryData } from "@/domain/TaskDomainService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { DateGrid, DayData } from "./date-grid";
import { getMonthName, isCurrentMonth } from "@/shared/DateUtils";

interface MonthlyHistoryProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onClose: () => void;
}

/**
 * 月の履歴を表示するコンポーネント
 * @param task - タスク
 * @param onToggle - タスクの完了状態を切り替える関数
 * @param onClose - モーダルを閉じる関数
 */
export function MonthlyHistory({
  task,
  onToggle,
  onClose,
}: MonthlyHistoryProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthlyData = formatMonthlyHistoryData(task, year, month);

  const weekDayLabels = ["日", "月", "火", "水", "木", "金", "土"];

  /**
   * 前月に移動する関数
   */
  const goToPreviousMonth = (): void => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(prevMonth);
  };

  /**
   * 翌月に移動する関数
   */
  const goToNextMonth = (): void => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  /**
   * 今月に移動する関数
   */
  const goToCurrentMonth = (): void => {
    setCurrentDate(new Date());
  };

  /**
   * 日付をクリックしたときの処理
   * タスクの完了状態を切り替える
   * @param dayData - 日付データ
   */
  const handleDayClick = (dayData: DayData): void => {
    const today = new Date();
    if (
      dayData.isCurrentMonth &&
      dayData.date.toDateString() === today.toDateString()
    ) {
      onToggle(task.configuration.id);
    }
  };

  /**
   * 月別表示用の日付フォーマット関数
   * @param date - 日付
   * @returns フォーマットされた日付文字列
   */
  const formatMonthlyDate = (date: Date): string => {
    return `${date.getDate()}日`;
  };

  /**
   * 月別表示用のクリック可能判定関数
   * @param dayData - 日付データ
   * @returns クリック可能かどうか
   */
  const isMonthlyClickable = (dayData: DayData): boolean => {
    return dayData.isCurrentMonth === true && dayData.isToday === true;
  };

  /**
   * 月別表示用のスタイル関数
   * @param dayData - 日付データ
   * @returns スタイルクラス名
   */
  const getMonthlyDayStyle = (dayData: DayData): string => {
    if (dayData.isCompleted) {
      return "text-green-700";
    }
    if (dayData.isCurrentMonth) {
      if (dayData.isToday) {
        return "bg-blue-100 text-blue-600 hover:bg-blue-200";
      }
      return "text-gray-700 hover:bg-gray-50";
    }
    return "text-gray-400";
  };

  return (
    <div className="space-y-4">
      {/* 月のナビゲーション */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousMonth}
          className="text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          先月
        </Button>

        <div className="flex items-center">
          <span className="text-sm font-medium">
            {getMonthName(year, month)}
          </span>

          {isCurrentMonth(year, month) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={goToCurrentMonth}
              className="text-blue-600 hover:text-blue-700 text-xs"
            >
              今月
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextMonth}
          className="text-gray-500 hover:text-gray-700"
        >
          翌月
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* 戻るボタン */}
      <div className="flex justify-start">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-blue-600 hover:text-blue-700"
        >
          戻る
        </Button>
      </div>

      {/* 月別カレンダー */}
      <DateGrid
        weekDayLabels={weekDayLabels}
        days={monthlyData.days}
        onDayClick={handleDayClick}
        formatDate={formatMonthlyDate}
        showCompletionIcon={true}
        isClickable={isMonthlyClickable}
        getDayStyle={getMonthlyDayStyle}
      />

      {/* 月の統計 */}
      <div className="text-center text-sm text-gray-600">
        {getMonthName(year, month)}の完了: {monthlyData.totalCompletions}回
      </div>
    </div>
  );
}
