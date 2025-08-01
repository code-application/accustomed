"use client";

import { Task } from "@/types";
import { calculateNewTaskStats } from "@/lib/taskUtils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { TrendingUp, Target, CheckCircle, Calendar } from "lucide-react";

interface DashboardProps {
  tasks: Task[];
}
/**
 * ダッシュボードコンポーネント(未使用)
 * @param {Task[]} tasks - タスクの一覧
 * @returns {JSX.Element} ダッシュボードコンポーネント
 */
export function Dashboard({ tasks }: DashboardProps) {
  const stats = calculateNewTaskStats(tasks);

  const statCards = [
    {
      title: "今日の完了",
      value: `${stats.completedToday}/${stats.totalTasks}`,
      icon: CheckCircle,
    },
    {
      title: "連続記録",
      value: `${stats.currentStreak}日`,
      icon: TrendingUp,
    },
    {
      title: "完了率",
      value: `${Math.round(stats.completionRate)}%`,
      icon: Target,
    },
    {
      title: "総完了数",
      value: stats.totalCompletions,
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Avatar>
                <AvatarFallback>
                  <stat.icon className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
