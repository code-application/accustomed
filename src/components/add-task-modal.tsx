"use client";

import { useState } from "react";
import { Task, TaskConfiguration, FrequencyUnit, DurationUnit } from "@/types";
import { generateTaskConfigurationId } from "@/lib/taskUtils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";

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
  const [durationUnit, setDurationUnit] = useState<DurationUnit>(
    editingTask?.configuration.duration.unit || "month"
  );
  const [durationLength, setDurationLength] = useState(
    editingTask?.configuration.duration.length || 1
  );

  const handleSubmit = (e: React.FormEvent, shouldClose: boolean = true) => {
    e.preventDefault();

    if (!content.trim()) return;

    const configuration: TaskConfiguration = {
      id: editingTask?.configuration.id || generateTaskConfigurationId(),
      content: content.trim(),
      frequency: {
        unit: frequencyUnit,
        count: frequencyCount,
      },
      duration: {
        startedAt: editingTask?.configuration.duration.startedAt || new Date(),
        unit: durationUnit,
        length: durationLength,
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
      setDurationUnit("month");
      setDurationLength(1);
    }
  };

  /**
   * モーダルを閉じる
   */
  const handleClose = () => {
    setContent("");
    setFrequencyUnit("day");
    setFrequencyCount(1);
    setDurationUnit("month");
    setDurationLength(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {/* モーダルのタイトル */}
        <DialogHeader>
          <DialogTitle>
            {editingTask ? "習慣を編集" : "新しい習慣を追加"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div>
            {/* 習慣の内容 */}
            <Label htmlFor="content">習慣の内容</Label>
            <Input
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="例: 毎日30分読書する"
              required
            />
          </div>

          {/* 頻度 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency-count">頻度</Label>
              <Input
                id="frequency-count"
                type="number"
                min="1"
                value={frequencyCount}
                onChange={(e) => setFrequencyCount(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="frequency-unit">単位</Label>
              <Select
                value={frequencyUnit}
                onValueChange={(value: FrequencyUnit) =>
                  setFrequencyUnit(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">日</SelectItem>
                  <SelectItem value="week">週</SelectItem>
                  <SelectItem value="month">月</SelectItem>
                  <SelectItem value="year">年</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 期間 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration-length">期間</Label>
              <Input
                id="duration-length"
                type="number"
                min="1"
                value={durationLength}
                onChange={(e) => setDurationLength(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="duration-unit">期間単位</Label>
              <Select
                value={durationUnit}
                onValueChange={(value: DurationUnit) => setDurationUnit(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">日</SelectItem>
                  <SelectItem value="week">週</SelectItem>
                  <SelectItem value="month">月</SelectItem>
                  <SelectItem value="year">年</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* モーダルのフッター */}
          <DialogFooter>
            {/* キャンセルボタン */}
            <Button type="button" variant="outline" onClick={handleClose}>
              キャンセル
            </Button>
            {/* 保存して続けて作成ボタン */}
            {!editingTask && (
              <Button
                type="button"
                variant="secondary"
                onClick={(e) => handleSubmit(e, false)}
              >
                保存して続けて作成
              </Button>
            )}
            {/* 保存して閉じるボタン */}
            <Button type="submit">
              {editingTask ? "更新" : "保存して閉じる"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
