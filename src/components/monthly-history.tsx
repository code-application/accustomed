"use client";

import { useState } from "react";
import { Task } from "@/types";
import { formatMonthlyHistoryData } from "@/lib/taskUtils";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

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

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  /**
   * 前月に移動する関数
   */
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(prevMonth);
  };

  /**
   * 翌月に移動する関数
   */
  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  /**
   * 今月に移動する関数
   */
  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  /**
   * 今月かどうかを判定する関数
   * @returns 今月かどうか
   */
  const isCurrentMonth = () => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month;
  };

  /**
   * 月の名前を取得する関数
   * @param year - 年
   * @param month - 月
   * @returns 月の名前
   */
  const getMonthName = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    return date.toLocaleDateString("ja-JP", { year: "numeric", month: "long" });
  };

  /**
   * 日付をクリックしたときの処理
   * @param dayData - 日付データ
   */
  const handleDayClick = (dayData: any) => {
    const today = new Date();
    if (
      dayData.isCurrentMonth &&
      dayData.date.toDateString() === today.toDateString()
    ) {
      onToggle(task.configuration.id);
    }
  };

  // 週ごとに日付をグループ化
  const weeks = [];
  for (let i = 0; i < monthlyData.days.length; i += 7) {
    weeks.push(monthlyData.days.slice(i, i + 7));
  }

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

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {getMonthName(year, month)}
          </span>
          {!isCurrentMonth() && (
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

      {/* カレンダーグリッド */}
      <div className="border border-gray-200 rounded-sm overflow-hidden">
        {/* 曜日ラベル */}
        <div className="grid grid-cols-7 gap-0">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="text-center p-1 bg-gray-50 border-r border-gray-200 last:border-r-0"
            >
              <div className="text-xs text-gray-500 font-medium">{day}</div>
            </div>
          ))}
        </div>

        {/* 週ごとの日付 */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-0">
            {week.map((dayData, dayIndex) => (
              <div
                key={dayIndex}
                className={`
                  text-center p-0.5 border-r border-gray-200 last:border-r-0 border-t border-gray-200 aspect-square
                  ${dayData.isCompleted ? "bg-green-100 border-green-300" : ""}
                `}
              >
                <button
                  onClick={() => handleDayClick(dayData)}
                  disabled={!dayData.isCurrentMonth || !dayData.isToday}
                  className={`
                    w-full h-full flex items-center justify-center text-xs font-medium
                    transition-colors duration-200
                    ${
                      dayData.isCompleted
                        ? "text-green-700"
                        : dayData.isCurrentMonth
                        ? dayData.isToday
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                        : "text-gray-400"
                    }
                    ${
                      !dayData.isCurrentMonth || !dayData.isToday
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  `}
                  title={dayData.date.toLocaleDateString("ja-JP")}
                >
                  {dayData.isCompleted ? (
                    <div className="flex items-center space-x-0.5">
                      <Check className="w-2 h-2 text-green-600" />
                      <span className="text-xs">{dayData.date.getDate()}</span>
                    </div>
                  ) : (
                    `${dayData.date.getDate()}`
                  )}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 月の統計 */}
      <div className="text-center text-sm text-gray-600">
        {getMonthName(year, month)}の完了: {monthlyData.totalCompletions}回
      </div>
    </div>
  );
}
