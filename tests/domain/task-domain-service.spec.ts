import { describe, expect, test, beforeEach } from "vitest";
import {
  generateTaskConfigurationId,
  generateTaskInstanceId,
  generateTaskInstance,
  isTaskInstanceCompletedToday,
  isSameDate,
  toggleTaskInstanceCompletion,
  createTaskInstance,
  toggleTaskInstanceCompletionById,
  calculateNewTaskStats,
  getWeeklyInstances,
  getMonthlyInstances,
  calculateRemainingDays,
  formatMonthlyHistoryData,
  formatWeeklyData,
} from "@/domain/task-domain-service";
import {
  Task,
  TaskConfiguration,
  TaskInstance,
  TaskStatus,
} from "@/domain/task";

describe("Task Domain Service", () => {
  let mockTaskConfiguration: TaskConfiguration;
  let mockTaskInstance: TaskInstance;
  let mockTask: Task;

  beforeEach(() => {
    mockTaskConfiguration = {
      id: "test-config-1",
      content: "テストタスク",
      frequency: { unit: "day", count: 1 },
      duration: { deadline: new Date("2024-12-31") },
      createdAt: new Date("2024-01-01"),
    };

    mockTaskInstance = {
      id: "test-instance-1",
      configurationId: "test-config-1",
      status: "not-started",
      scheduledDate: new Date("2024-01-01"),
      createdAt: new Date("2024-01-01"),
    };

    mockTask = {
      configuration: mockTaskConfiguration,
      instances: [mockTaskInstance],
    };
  });

  describe("generateTaskConfigurationId", () => {
    test("should generate unique configuration ID", () => {
      const id1 = generateTaskConfigurationId();
      const id2 = generateTaskConfigurationId();

      expect(id1).toMatch(/^task-config-\d+-\w+$/);
      expect(id2).toMatch(/^task-config-\d+-\w+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe("generateTaskInstanceId", () => {
    test("should generate unique instance ID", () => {
      const id1 = generateTaskInstanceId();
      const id2 = generateTaskInstanceId();

      expect(id1).toMatch(/^task-instance-\d+-\w+$/);
      expect(id2).toMatch(/^task-instance-\d+-\w+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe("generateTaskInstance", () => {
    test("should generate task instance from configuration", () => {
      const instance = generateTaskInstance(mockTaskConfiguration);

      expect(instance.configurationId).toBe(mockTaskConfiguration.id);
      expect(instance.status).toBe("not-started");
      expect(instance.scheduledDate).toBeInstanceOf(Date);
      expect(instance.createdAt).toBeInstanceOf(Date);
    });
  });

  describe("isTaskInstanceCompletedToday", () => {
    test("should return false for incomplete task", () => {
      const result = isTaskInstanceCompletedToday(mockTaskInstance);
      expect(result).toBe(false);
    });

    test("should return true for task completed today", () => {
      const completedInstance = {
        ...mockTaskInstance,
        status: "done" as TaskStatus,
        completedDate: new Date(),
      };

      const result = isTaskInstanceCompletedToday(completedInstance);
      expect(result).toBe(true);
    });

    test("should return false for task completed yesterday", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const completedInstance = {
        ...mockTaskInstance,
        status: "done" as TaskStatus,
        completedDate: yesterday,
      };

      const result = isTaskInstanceCompletedToday(completedInstance);
      expect(result).toBe(false);
    });
  });

  describe("isSameDate", () => {
    test("should return true for same dates", () => {
      const date1 = new Date("2024-01-01");
      const date2 = new Date("2024-01-01");

      expect(isSameDate(date1, date2)).toBe(true);
    });

    test("should return false for different dates", () => {
      const date1 = new Date("2024-01-01");
      const date2 = new Date("2024-01-02");

      expect(isSameDate(date1, date2)).toBe(false);
    });

    test("should handle string dates", () => {
      const date1 = "2024-01-01";
      const date2 = new Date("2024-01-01");

      expect(isSameDate(date1, date2)).toBe(true);
    });
  });

  describe("toggleTaskInstanceCompletion", () => {
    test("should mark incomplete task as done", () => {
      const result = toggleTaskInstanceCompletion(mockTaskInstance);

      expect(result.status).toBe("done");
      expect(result.completedDate).toBeInstanceOf(Date);
    });

    test("should mark completed task as not started", () => {
      const completedInstance = {
        ...mockTaskInstance,
        status: "done" as TaskStatus,
        completedDate: new Date(),
      };

      const result = toggleTaskInstanceCompletion(completedInstance);

      expect(result.status).toBe("not-started");
      expect(result.completedDate).toBeUndefined();
    });
  });

  describe("createTaskInstance", () => {
    test("should create new task instance", () => {
      const scheduledDate = new Date("2024-01-15");
      const instance = createTaskInstance("test-config-1", scheduledDate);

      expect(instance.configurationId).toBe("test-config-1");
      expect(instance.scheduledDate).toEqual(scheduledDate);
      expect(instance.status).toBe("not-started");
    });
  });

  describe("toggleTaskInstanceCompletionById", () => {
    test("should toggle specific task instance", () => {
      const updatedTask = toggleTaskInstanceCompletionById(
        mockTask,
        "test-instance-1"
      );

      expect(updatedTask.instances[0].status).toBe("done");
      expect(updatedTask.instances[0].completedDate).toBeInstanceOf(Date);
    });

    test("should not affect other instances", () => {
      const taskWithMultipleInstances = {
        ...mockTask,
        instances: [
          mockTaskInstance,
          {
            ...mockTaskInstance,
            id: "test-instance-2",
            status: "done" as TaskStatus,
            completedDate: new Date(),
          },
        ],
      };

      const updatedTask = toggleTaskInstanceCompletionById(
        taskWithMultipleInstances,
        "test-instance-1"
      );

      expect(updatedTask.instances[0].status).toBe("done");
      expect(updatedTask.instances[1].status).toBe("done");
    });
  });

  describe("calculateNewTaskStats", () => {
    test("should calculate stats for empty task list", () => {
      const stats = calculateNewTaskStats([]);

      expect(stats.totalTasks).toBe(0);
      expect(stats.completedToday).toBe(0);
      expect(stats.currentStreak).toBe(0);
      expect(stats.totalCompletions).toBe(0);
      expect(stats.completionRate).toBe(0);
    });

    test("should calculate stats for tasks with completions", () => {
      const today = new Date();
      const completedInstance = {
        ...mockTaskInstance,
        status: "done" as TaskStatus,
        completedDate: today,
        scheduledDate: today,
      };

      const taskWithCompletion = {
        ...mockTask,
        instances: [completedInstance],
      };

      const stats = calculateNewTaskStats([taskWithCompletion]);

      expect(stats.totalTasks).toBe(1);
      expect(stats.completedToday).toBe(1);
      expect(stats.totalCompletions).toBe(1);
      expect(stats.completionRate).toBe(100);
    });
  });

  describe("getWeeklyInstances", () => {
    test("should return instances for specific week", () => {
      const weekStart = new Date("2024-01-01"); // 月曜日
      const weekInstance = {
        ...mockTaskInstance,
        scheduledDate: new Date("2024-01-03"), // 水曜日
      };

      const taskWithWeekInstance = {
        ...mockTask,
        instances: [weekInstance],
      };

      const instances = getWeeklyInstances(taskWithWeekInstance, weekStart);

      expect(instances).toHaveLength(1);
      expect(instances[0].id).toBe("test-instance-1");
    });

    test("should not return instances outside week", () => {
      const weekStart = new Date("2024-01-01");
      const outsideWeekInstance = {
        ...mockTaskInstance,
        scheduledDate: new Date("2024-01-15"), // 翌週
      };

      const taskWithOutsideInstance = {
        ...mockTask,
        instances: [outsideWeekInstance],
      };

      const instances = getWeeklyInstances(taskWithOutsideInstance, weekStart);

      expect(instances).toHaveLength(0);
    });
  });

  describe("getMonthlyInstances", () => {
    test("should return instances for specific month", () => {
      const monthInstance = {
        ...mockTaskInstance,
        scheduledDate: new Date("2024-01-15"),
      };

      const taskWithMonthInstance = {
        ...mockTask,
        instances: [monthInstance],
      };

      const instances = getMonthlyInstances(taskWithMonthInstance, 2024, 0); // 2024年1月

      expect(instances).toHaveLength(1);
      expect(instances[0].id).toBe("test-instance-1");
    });

    test("should not return instances outside month", () => {
      const outsideMonthInstance = {
        ...mockTaskInstance,
        scheduledDate: new Date("2024-02-15"), // 2月
      };

      const taskWithOutsideInstance = {
        ...mockTask,
        instances: [outsideMonthInstance],
      };

      const instances = getMonthlyInstances(taskWithOutsideInstance, 2024, 0); // 2024年1月

      expect(instances).toHaveLength(0);
    });
  });

  describe("calculateRemainingDays", () => {
    test("should calculate remaining days", () => {
      const futureDeadline = new Date();
      futureDeadline.setDate(futureDeadline.getDate() + 10);

      const taskWithFutureDeadline = {
        ...mockTask,
        configuration: {
          ...mockTaskConfiguration,
          duration: { deadline: futureDeadline },
        },
      };

      const remaining = calculateRemainingDays(taskWithFutureDeadline);

      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThanOrEqual(10);
    });

    test("should return 0 for past deadline", () => {
      const pastDeadline = new Date();
      pastDeadline.setDate(pastDeadline.getDate() - 10);

      const taskWithPastDeadline = {
        ...mockTask,
        configuration: {
          ...mockTaskConfiguration,
          duration: { deadline: pastDeadline },
        },
      };

      const remaining = calculateRemainingDays(taskWithPastDeadline);

      expect(remaining).toBe(0);
    });
  });

  describe("formatWeeklyData", () => {
    test("should format weekly data correctly", () => {
      const weekStart = new Date("2024-01-01");
      const weekInstance = {
        ...mockTaskInstance,
        scheduledDate: new Date("2024-01-03"),
        status: "done" as TaskStatus,
        completedDate: new Date("2024-01-03"),
      };

      const taskWithWeekInstance = {
        ...mockTask,
        instances: [weekInstance],
      };

      const weeklyData = formatWeeklyData(taskWithWeekInstance, weekStart);

      expect(weeklyData.startDate).toEqual(weekStart);
      expect(weeklyData.days).toHaveLength(7);
      expect(weeklyData.totalCompletions).toBe(1);
      expect(weeklyData.days[2].isCompleted).toBe(true); // 水曜日
    });
  });

  describe("formatMonthlyHistoryData", () => {
    test("should format monthly data correctly", () => {
      const monthInstance = {
        ...mockTaskInstance,
        scheduledDate: new Date("2024-01-15"),
        status: "done" as TaskStatus,
        completedDate: new Date("2024-01-15"),
      };

      const taskWithMonthInstance = {
        ...mockTask,
        instances: [monthInstance],
      };

      const monthlyData = formatMonthlyHistoryData(
        taskWithMonthInstance,
        2024,
        0
      ); // 2024年1月

      expect(monthlyData.year).toBe(2024);
      expect(monthlyData.month).toBe(0);
      expect(monthlyData.totalCompletions).toBe(1);
      expect(monthlyData.days.length).toBeGreaterThan(28); // 月の日数 + 前後月の日付
    });
  });
});
