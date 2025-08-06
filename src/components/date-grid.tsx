"use client";

import { Check } from "lucide-react";

/**
 * 日付データのインターフェース
 */
export interface DayData {
  date: Date;
  isCompleted: boolean;
  isToday?: boolean;
  isCurrentMonth?: boolean;
  completionCount?: number;
}

/**
 * 日付グリッドのプロパティ
 */
interface DateGridProps {
  /** 曜日ラベル */
  weekDayLabels: string[];
  /** 日付データの配列 */
  days: DayData[];
  /** 日付をクリックしたときの処理 */
  onDayClick?: (dayData: DayData) => void;
  /** 日付フォーマット関数 */
  formatDate?: (date: Date) => string;
  /** 完了アイコンを表示するかどうか */
  showCompletionIcon?: boolean;
  /** カスタムクラス名 */
  className?: string;
  /** クリック可能判定関数 */
  isClickable?: (dayData: DayData) => boolean;
  /** 日付ボックスのスタイル関数 */
  getDayStyle?: (dayData: DayData) => string;
}
/**
 * デフォルトの日付ボックスのスタイル関数
 * @param dayData - 日付データ
 * @returns スタイルクラス名
 */
const getDefaultDayStyle = (dayData: DayData) => {
  if (dayData.isCompleted) {
    return "text-green-700";
  }
  if (dayData.isToday) {
    return "bg-blue-100 text-blue-600 hover:bg-blue-200";
  }
  if (dayData.isCurrentMonth !== undefined) {
    return dayData.isCurrentMonth
      ? "text-gray-700 hover:bg-gray-50"
      : "text-gray-400";
  }
  return "text-gray-400";
};

/**
 * 汎用的な日付グリッドコンポーネント
 * 週別・月別の表示で共通使用
 */
export function DateGrid({
  weekDayLabels,
  days,
  onDayClick,
  formatDate = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`,
  showCompletionIcon = true,
  className = "",
  isClickable = (dayData: DayData) => dayData.isToday ?? false,
  getDayStyle = (dayData: DayData) => getDefaultDayStyle(dayData),
}: DateGridProps) {
  /**
   * 日付ボックスをクリックしたときの処理
   * @param dayData - 日付データ
   */
  const handleDayClick = (dayData: DayData) => {
    if (onDayClick) {
      onDayClick(dayData);
    }
  };

  return (
    <div
      className={`grid grid-cols-7 gap-0 border border-gray-200 rounded-sm overflow-hidden ${className}`}
    >
      {/* 曜日ラベル */}
      {weekDayLabels.map((day, index) => (
        <div
          key={index}
          className="text-center p-1 bg-gray-50 border-r border-gray-200 last:border-r-0"
        >
          <div className="text-xs text-gray-500 font-medium">{day}</div>
        </div>
      ))}

      {/* 日付ボックス */}
      {days.map((dayData, index) => (
        <div
          key={index}
          className={`
            text-center p-1 border-r border-gray-200 last:border-r-0 border-t border-gray-200 aspect-square
            ${
              dayData.isCompleted
                ? "bg-green-100 border-green-100"
                : getDayStyle(dayData)
            }
          `}
        >
          <button
            onClick={() => handleDayClick(dayData)}
            disabled={!isClickable(dayData)}
            className={`
              w-full h-full flex items-center justify-center text-xs font-medium
              transition-colors duration-200
              ${!isClickable(dayData) ? "cursor-not-allowed" : "cursor-pointer"}
            `}
            title={dayData.date.toLocaleDateString("ja-JP")}
          >
            {dayData.isCompleted && showCompletionIcon ? (
              <div className="flex items-center space-x-1">
                <Check className="w-3 h-3 text-green-600" />
                <span className="text-xs">{formatDate(dayData.date)}</span>
              </div>
            ) : (
              formatDate(dayData.date)
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
