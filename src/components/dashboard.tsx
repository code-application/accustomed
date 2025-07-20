'use client';

import { Task, TaskStats } from '@/types';
import { calculateTaskStats } from '@/lib/taskUtils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, Target, CheckCircle, Calendar } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
}

export function Dashboard({ tasks }: DashboardProps) {
  const stats = calculateTaskStats(tasks);

  const statCards = [
    {
      title: '今日の完了',
      value: `${stats.completedToday}/${stats.totalTasks}`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: '連続記録',
      value: `${stats.currentStreak}日`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '完了率',
      value: `${Math.round(stats.completionRate)}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: '総完了数',
      value: stats.totalCompletions,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}