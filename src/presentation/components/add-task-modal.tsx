"use client";

import { useState } from "react";
import type { FrequencyUnit, Task, TaskConfiguration } from "@/domain/task";
import { generateTaskConfigurationId } from "@/domain/task-domain-service";
import { getEndOfMonthExample } from "@/shared/date-utils";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

/**
 * タスク追加モーダルコンポーネントのプロパティ
 * @interface AddTaskModalProps
 * @property {boolean} isOpen - モーダルが開いているかどうか
 * @property {Function} onClose - モーダルを閉じる関数
 * @property {Function} onSubmit - タスクを追加する関数
 * @property {Task} editingTask - 編集するタスク
 */
interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  editingTask?: Task;
}
/*
 * タスク追加モーダルコンポーネント
 * @param {boolean} isOpen - モーダルが開いているかどうか
 * @param {Function} onClose - モーダルを閉じる関数
 * @param {Function} onSubmit - タスクを追加する関数
 * @param {Task} editingTask - 編集するタスク
 * @returns {JSX.Element} タスク追加モーダルコンポーネント
 */
export function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
  editingTask,
}: AddTaskModalProps) {
  const [content, setContent] = useState(
    editingTask?.configuration.content || ""
  );
  const [frequencyUnit, setFrequencyUnit] = useState<FrequencyUnit>(
    editingTask?.configuration.frequency.unit || "day"
  );
  const [frequencyCount, setFrequencyCount] = useState(
    editingTask?.configuration.frequency.count || 1
  );
  const [deadline, setDeadline] = useState(
    editingTask?.configuration.duration.deadline
      ? new Date(editingTask.configuration.duration.deadline)
          .toISOString()
          .split("T")[0]
      : ""
  );
  /**
   * タスクを追加する関数
   * @param {React.FormEvent} e - フォームのイベント
   * @param {boolean} shouldClose - モーダルを閉じるかどうか
   */
  const handleSubmit = (e: React.FormEvent, shouldClose: boolean = true) => {
    e.preventDefault();

    if (!content.trim() || !deadline) return;

    const configuration: TaskConfiguration = {
      id: editingTask?.configuration.id || generateTaskConfigurationId(),
      content: content.trim(),
      frequency: {
        unit: frequencyUnit,
        count: frequencyCount,
      },
      duration: {
        deadline: new Date(deadline),
      },
      createdAt: editingTask?.configuration.createdAt || new Date(),
    };

    const task: Task = {
      configuration,
      instances: editingTask?.instances || [],
    };

    onSubmit(task);

    if (shouldClose || editingTask) {
      handleClose();
    } else {
      // 連続作成時はフォームのみリセット
      setContent("");
      setFrequencyUnit("day");
      setFrequencyCount(1);
      setDeadline("");
    }
  };

  /**
   * モーダルを閉じる関数
   */
  const handleClose = () => {
    setContent("");
    setFrequencyUnit("day");
    setFrequencyCount(1);
    setDeadline("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingTask ? "習慣を編集" : "新しい習慣を追加"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div>
            <Label htmlFor="content">習慣の内容</Label>
            <Input
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="例: 毎日30分読書する"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency">頻度</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select
                  value={frequencyUnit}
                  onValueChange={(value: FrequencyUnit) =>
                    setFrequencyUnit(value)
                  }
                >
                  <SelectTrigger className="w-16 sm:w-20">
                    <SelectValue placeholder="単位" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">日</SelectItem>
                    <SelectItem value="week">週</SelectItem>
                    <SelectItem value="month">月</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="frequency-count"
                  type="number"
                  min="1"
                  value={frequencyCount || ""}
                  onChange={(e) =>
                    setFrequencyCount(Number(e.target.value) || 0)
                  }
                  className="w-12 sm:w-16"
                  title="頻度を入力してください（例：3）"
                  required
                />
                <span className="text-sm text-gray-600">回</span>
              </div>
            </div>

            <div>
              <Label htmlFor="deadline">期限</Label>
              <div className="flex items-center space-x-2 mt-1">
                <div className="relative flex-1 min-w-0">
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={`pr-8 sm:pr-10 [&::-webkit-calendar-picker-indicator]:hidden ${
                      deadline
                        ? "text-gray-900"
                        : "text-gray-500 placeholder:text-gray-400"
                    }`}
                    placeholder="yyyy/mm/dd"
                    title={`期限を入力してください（例：${getEndOfMonthExample()}）`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                    <svg
                      className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      onClick={() => {
                        const input = document.getElementById(
                          "deadline"
                        ) as HTMLInputElement;
                        if (input) input.showPicker();
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap flex-shrink-0">
                  まで
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              キャンセル
            </Button>
            {!editingTask && (
              <Button
                type="button"
                variant="secondary"
                onClick={(e) => handleSubmit(e, false)}
              >
                保存して続けて作成
              </Button>
            )}
            <Button type="submit">
              {editingTask ? "更新" : "保存して閉じる"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
