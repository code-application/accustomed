"use client";

import { useState } from "react";
import { Task } from "@/domain/task";
import {
  isSameDate,
  calculateRemainingDays,
} from "@/domain/task-domain-service";
import { calculateStreak } from "@/domain/date-domain-service";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Trash2, Edit } from "lucide-react";
import { WeeklyProgress } from "./weekly-progress";
import { MonthlyHistory } from "./monthly-history";

/**
 * タスクカードコンポーネントのプロパティ
 * @interface TaskCardProps
 * @property {Task} task - タスクオブジェクト
 * @property {Function} onToggle - タスクの完了状態を切り替える関数
 * @property {Function} onDelete - タスクを削除する関数
 * @property {Function} onEdit - タスクを編集する関数
 */
interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

/**
 * タスクカードコンポーネント
 * @param {TaskCardProps} props - タスクカードのプロパティ
 * @param {Task} props.task - タスクオブジェクト
 * @param {Function} props.onToggle - タスクの完了状態を切り替える関数
 * @param {Function} props.onDelete - タスクを削除する関数
 * @param {Function} props.onEdit - タスクを編集する関数
 */
export function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  const [showMonthlyCalendar, setShowMonthlyCalendar] = useState(false);

  const today = new Date();
  const todayInstance = task.instances.find((instance) =>
    isSameDate(instance.scheduledDate, today)
  );
  const isCompleted = todayInstance?.status === "done";

  // 完了したインスタンスの日付を取得して連続記録を計算
  const completedDates = task.instances
    .filter((instance) => instance.status === "done" && instance.completedDate)
    .map((instance) => {
      const completedDate =
        instance.completedDate instanceof Date
          ? instance.completedDate
          : new Date(instance.completedDate!);
      return completedDate.toISOString().split("T")[0];
    })
    .sort();
  const streak = calculateStreak(completedDates);
  const totalCompletions = task.instances.filter(
    (instance) => instance.status === "done"
  ).length;
  const remainingDays = calculateRemainingDays(task);

  // 期限の日付を取得
  const deadline = task.configuration.duration.deadline;
  const deadlineText = deadline.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const frequencyText = `${
    task.configuration.frequency.unit === "day"
      ? "日"
      : task.configuration.frequency.unit === "week"
      ? "週"
      : task.configuration.frequency.unit === "month"
      ? "月"
      : "年"
  }${task.configuration.frequency.count}回`;

  return (
    <Card className={isCompleted ? "ring-2 ring-green-200 bg-green-50" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-1">
              <h3
                className={`font-medium ${isCompleted ? "text-green-800" : ""}`}
              >
                {task.configuration.content}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {frequencyText}
              </p>
              {/* 連続記録と総計バッジ */}
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  連続 {streak}日
                </Badge>
                <Badge variant="outline" className="text-xs">
                  総計 {totalCompletions}回
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex space-x-1">
            {/* 完了ボタン */}
            <Button
              variant={isCompleted ? "default" : "outline"}
              size="sm"
              onClick={() => onToggle(task.configuration.id)}
              className={`
                ${
                  isCompleted
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                }
              `}
            >
              {isCompleted ? "完了済み" : "完了"}
            </Button>
            {/* 編集ボタン */}
            <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
              <Edit className="h-4 w-4" />
            </Button>
            {/* 削除ボタン */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.configuration.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 週間ビューまたは月別履歴 */}
        <div className="mt-4">
          {!showMonthlyCalendar ? (
            <>
              <WeeklyProgress task={task} onToggle={onToggle} />
            </>
          ) : (
            <>
              <MonthlyHistory
                task={task}
                onToggle={onToggle}
                onClose={() => setShowMonthlyCalendar(false)}
              />
            </>
          )}
          {/* タスクカードのフッター */}
          <div className="flex justify-between items-center mt-3">
            {!showMonthlyCalendar ? (
              <button
                onClick={() => setShowMonthlyCalendar(true)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                カレンダーを見る
              </button>
            ) : (
              <div></div> // 月別履歴を表示しているときは何も表示しない
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>残り{remainingDays}日！</span>
              <span>|</span>
              <span>{deadlineText}まで</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
