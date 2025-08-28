import { describe, expect, test } from "vitest";
import {
  Task,
  TaskConfiguration,
  TaskInstance,
  TaskFrequency,
  TaskDuration,
  TaskStatus,
  FrequencyUnit,
  TaskStats,
  WeeklyData,
  WeeklyDayData,
  MonthlyHistoryData,
  DayData,
} from "@/domain/task";

describe("Task Model", () => {
  describe("TaskConfiguration", () => {
    test("should have correct structure", () => {
      const config: TaskConfiguration = {
        id: "test-config-1",
        content: "テストタスク",
        frequency: { unit: "day", count: 1 },
        duration: { deadline: new Date("2024-12-31") },
        createdAt: new Date("2024-01-01"),
      };

      expect(config.id).toBe("test-config-1");
      expect(config.content).toBe("テストタスク");
      expect(config.frequency.unit).toBe("day");
      expect(config.frequency.count).toBe(1);
      expect(config.duration.deadline).toBeInstanceOf(Date);
      expect(config.createdAt).toBeInstanceOf(Date);
    });
  });

  describe("TaskInstance", () => {
    test("should have correct structure", () => {
      const instance: TaskInstance = {
        id: "test-instance-1",
        configurationId: "test-config-1",
        status: "not-started",
        scheduledDate: new Date("2024-01-01"),
        createdAt: new Date("2024-01-01"),
      };

      expect(instance.id).toBe("test-instance-1");
      expect(instance.configurationId).toBe("test-config-1");
      expect(instance.status).toBe("not-started");
      expect(instance.scheduledDate).toBeInstanceOf(Date);
      expect(instance.createdAt).toBeInstanceOf(Date);
      expect(instance.completedDate).toBeUndefined();
    });

    test("should handle completed instance", () => {
      const completedInstance: TaskInstance = {
        id: "test-instance-2",
        configurationId: "test-config-1",
        status: "done",
        scheduledDate: new Date("2024-01-01"),
        completedDate: new Date("2024-01-01"),
        createdAt: new Date("2024-01-01"),
      };

      expect(completedInstance.status).toBe("done");
      expect(completedInstance.completedDate).toBeInstanceOf(Date);
    });
  });

  describe("Task", () => {
    test("should have correct structure", () => {
      const task: Task = {
        configuration: {
          id: "test-config-1",
          content: "テストタスク",
          frequency: { unit: "day", count: 1 },
          duration: { deadline: new Date("2024-12-31") },
          createdAt: new Date("2024-01-01"),
        },
        instances: [
          {
            id: "test-instance-1",
            configurationId: "test-config-1",
            status: "not-started",
            scheduledDate: new Date("2024-01-01"),
            createdAt: new Date("2024-01-01"),
          },
        ],
      };

      expect(task.configuration).toBeDefined();
      expect(task.instances).toHaveLength(1);
      expect(task.instances[0].configurationId).toBe(task.configuration.id);
    });
  });

  describe("TaskFrequency", () => {
    test("should support different frequency units", () => {
      const daily: TaskFrequency = { unit: "day", count: 1 };
      const weekly: TaskFrequency = { unit: "week", count: 2 };
      const monthly: TaskFrequency = { unit: "month", count: 1 };

      expect(daily.unit).toBe("day");
      expect(weekly.unit).toBe("week");
      expect(monthly.unit).toBe("month");
    });
  });

  describe("TaskDuration", () => {
    test("should have deadline", () => {
      const duration: TaskDuration = {
        deadline: new Date("2024-12-31"),
      };

      expect(duration.deadline).toBeInstanceOf(Date);
    });
  });

  describe("TaskStatus", () => {
    test("should support all status values", () => {
      const statuses: TaskStatus[] = ["not-started", "in-progress", "done"];

      statuses.forEach((status) => {
        expect(["not-started", "in-progress", "done"]).toContain(status);
      });
    });
  });

  describe("FrequencyUnit", () => {
    test("should support all frequency units", () => {
      const units: FrequencyUnit[] = ["day", "week", "month"];

      units.forEach((unit) => {
        expect(["day", "week", "month"]).toContain(unit);
      });
    });
  });

  describe("TaskStats", () => {
    test("should have correct structure", () => {
      const stats: TaskStats = {
        totalTasks: 5,
        completedToday: 3,
        currentStreak: 7,
        totalCompletions: 25,
        completionRate: 60.0,
      };

      expect(stats.totalTasks).toBe(5);
      expect(stats.completedToday).toBe(3);
      expect(stats.currentStreak).toBe(7);
      expect(stats.totalCompletions).toBe(25);
      expect(stats.completionRate).toBe(60.0);
    });
  });

  describe("WeeklyData", () => {
    test("should have correct structure", () => {
      const weeklyData: WeeklyData = {
        startDate: new Date("2024-01-01"),
        days: [
          {
            date: new Date("2024-01-01"),
            isCompleted: true,
            isToday: false,
          },
          {
            date: new Date("2024-01-02"),
            isCompleted: false,
            isToday: true,
          },
        ],
        totalCompletions: 1,
      };

      expect(weeklyData.startDate).toBeInstanceOf(Date);
      expect(weeklyData.days).toHaveLength(2);
      expect(weeklyData.totalCompletions).toBe(1);
    });
  });

  describe("WeeklyDayData", () => {
    test("should have correct structure", () => {
      const dayData: WeeklyDayData = {
        date: new Date("2024-01-01"),
        isCompleted: true,
        isToday: false,
      };

      expect(dayData.date).toBeInstanceOf(Date);
      expect(dayData.isCompleted).toBe(true);
      expect(dayData.isToday).toBe(false);
    });
  });

  describe("MonthlyHistoryData", () => {
    test("should have correct structure", () => {
      const monthlyData: MonthlyHistoryData = {
        year: 2024,
        month: 0, // 1月
        days: [
          {
            date: new Date("2024-01-01"),
            isCompleted: true,
            completionCount: 1,
            isCurrentMonth: true,
            isToday: false,
          },
        ],
        totalCompletions: 1,
      };

      expect(monthlyData.year).toBe(2024);
      expect(monthlyData.month).toBe(0);
      expect(monthlyData.days).toHaveLength(1);
      expect(monthlyData.totalCompletions).toBe(1);
    });
  });

  describe("DayData", () => {
    test("should have correct structure", () => {
      const dayData: DayData = {
        date: new Date("2024-01-01"),
        isCompleted: true,
        completionCount: 1,
        isCurrentMonth: true,
        isToday: false,
      };

      expect(dayData.date).toBeInstanceOf(Date);
      expect(dayData.isCompleted).toBe(true);
      expect(dayData.completionCount).toBe(1);
      expect(dayData.isCurrentMonth).toBe(true);
      expect(dayData.isToday).toBe(false);
    });

    test("should handle optional completionCount", () => {
      const dayData: DayData = {
        date: new Date("2024-01-01"),
        isCompleted: false,
        isCurrentMonth: true,
        isToday: false,
      };

      expect(dayData.completionCount).toBeUndefined();
    });
  });
});
