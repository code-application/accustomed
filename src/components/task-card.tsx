"use client";

import { Task } from "@/types";
import { isTaskInstanceCompletedToday, isSameDate } from "@/lib/taskUtils";
import { calculateStreak } from "@/lib/dateUtils";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Trash2, Edit } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}
/*
 * タスクカードコンポーネント
 * @param {Task} task - タスク
 * @param {Function} onToggle - タスクの完了状態を切り替える関数
 * @param {Function} onDelete - タスクを削除する関数
 * @param {Function} onEdit - タスクを編集する関数
 * @returns {JSX.Element} タスクカードコンポーネント
 */
export function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
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
  // 総計
  const totalCompletions = task.instances.filter(
    (instance) => instance.status === "done"
  ).length;

  const frequencyText = `${task.configuration.frequency.count}${
    task.configuration.frequency.unit === "day"
      ? "日"
      : task.configuration.frequency.unit === "week"
      ? "週"
      : task.configuration.frequency.unit === "month"
      ? "月"
      : "年"
  }ごと`;

  return (
    <Card className={isCompleted ? "ring-2 ring-green-200 bg-green-50" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() => onToggle(task.configuration.id)}
              className="mt-1"
            />

            <div className="flex-1">
              {/* タスクの内容 */}
              <h3
                className={`font-medium ${isCompleted ? "text-green-800" : ""}`}
              >
                {task.configuration.content}
              </h3>

              {/* 頻度 */}
              <p className="text-sm text-muted-foreground mt-1">
                {frequencyText}
              </p>

              {/* 連続記録と総計 */}
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
      </CardContent>
    </Card>
  );
}
