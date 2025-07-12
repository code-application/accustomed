'use client';

import { getWeeklyProgress } from '@/lib/dateUtils';
import { Task } from '@/types';

interface ProgressChartProps {
  tasks: Task[];
}

export function ProgressChart({ tasks }: ProgressChartProps) {
  const weeklyData = tasks.length > 0 
    ? getWeeklyProgress(tasks.flatMap(task => task.completedDates))
    : [0, 0, 0, 0, 0, 0, 0];

  const maxValue = Math.max(...weeklyData, 1);
  const days = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">週間進捗</h3>
      <div className="flex items-end justify-between h-32 gap-2">
        {weeklyData.map((value, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600"
              style={{
                height: `${(value / maxValue) * 100}%`,
                minHeight: value > 0 ? '4px' : '0px',
              }}
            />
            <div className="h-8 flex items-center">
              <span className="text-sm font-medium text-gray-600 mt-2">
                {days[index]}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-center">
        <span className="text-sm text-gray-500">
          今週の完了タスク数: {weeklyData.reduce((sum, val) => sum + val, 0)}
        </span>
      </div>
    </div>
  );
}