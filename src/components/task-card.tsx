'use client';

import { Task } from '@/types';
import { isTaskCompletedToday } from '@/lib/taskUtils';
import { calculateStreak } from '@/lib/dateUtils';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Trash2, Edit } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  const isCompleted = isTaskCompletedToday(task);
  const streak = calculateStreak(task.completedDates);
  const totalCompletions = task.completedDates.length;

  const frequencyText = `${task.frequency.count}${
    task.frequency.unit === 'day' ? '日' :
    task.frequency.unit === 'week' ? '週' :
    task.frequency.unit === 'month' ? '月' : '年'
  }ごと`;

  return (
    <Card className={isCompleted ? 'ring-2 ring-green-200 bg-green-50' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() => onToggle(task.id)}
              className="mt-1"
            />
            
            <div className="flex-1">
              <h3 className={`font-medium ${isCompleted ? 'text-green-800' : ''}`}>
                {task.content}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {frequencyText}
              </p>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}