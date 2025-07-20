'use client';

import { useState } from 'react';
import { Task, FrequencyUnit, DurationUnit } from '@/types';
import { generateTaskId } from '@/lib/taskUtils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  editingTask?: Task;
}

export function AddTaskModal({ isOpen, onClose, onSubmit, editingTask }: AddTaskModalProps) {
  const [content, setContent] = useState(editingTask?.content || '');
  const [frequencyUnit, setFrequencyUnit] = useState<FrequencyUnit>(
    editingTask?.frequency.unit || 'day'
  );
  const [frequencyCount, setFrequencyCount] = useState(
    editingTask?.frequency.count || 1
  );
  const [durationUnit, setDurationUnit] = useState<DurationUnit>(
    editingTask?.duration.unit || 'month'
  );
  const [durationLength, setDurationLength] = useState(
    editingTask?.duration.length || 1
  );

  const handleSubmit = (e: React.FormEvent, shouldClose: boolean = true) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    const task: Task = {
      id: editingTask?.id || generateTaskId(),
      content: content.trim(),
      status: editingTask?.status || 'not-started',
      frequency: {
        unit: frequencyUnit,
        count: frequencyCount,
      },
      duration: {
        startedAt: editingTask?.duration.startedAt || new Date(),
        unit: durationUnit,
        length: durationLength,
      },
      createdAt: editingTask?.createdAt || new Date(),
      completedDates: editingTask?.completedDates || [],
    };

    onSubmit(task);
    
    if (shouldClose || editingTask) {
      handleClose();
    } else {
      // 連続作成時はフォームのみリセット
      setContent('');
      setFrequencyUnit('day');
      setFrequencyCount(1);
      setDurationUnit('month');
      setDurationLength(1);
    }
  };

  const handleClose = () => {
    setContent('');
    setFrequencyUnit('day');
    setFrequencyCount(1);
    setDurationUnit('month');
    setDurationLength(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingTask ? '習慣を編集' : '新しい習慣を追加'}
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
              <Select value={frequencyUnit} onValueChange={(value: FrequencyUnit) => setFrequencyUnit(value)}>
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
              <Select value={durationUnit} onValueChange={(value: DurationUnit) => setDurationUnit(value)}>
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

          <DialogFooter>
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
              {editingTask ? '更新' : '保存して閉じる'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}