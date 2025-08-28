import { renderHook, act } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { useTasks } from "@/presentation/hooks/useTasks";
import { Task } from "@/domain/task";

// モック
vi.mock("@/infrastructure/local-storage", () => ({
  loadTasks: vi.fn(),
  saveTasks: vi.fn(),
}));

import { loadTasks, saveTasks } from "@/infrastructure/local-storage";

const mockLoadTasks = loadTasks as vi.MockedFunction<typeof loadTasks>;
const mockSaveTasks = saveTasks as vi.MockedFunction<typeof saveTasks>;

const createMockTask = (id: string, content: string): Task => ({
  configuration: {
    id,
    content,
    frequency: { unit: "day", count: 1 },
    duration: { deadline: new Date("2024-12-31") },
    createdAt: new Date(),
  },
  instances: [],
});

describe("useTasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadTasks.mockReturnValue([]);
  });

  test("should initialize with empty tasks", () => {
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.tasks).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  test("should load tasks from storage on mount", () => {
    const mockTasks = [
      createMockTask("task-1", "テスト習慣1"),
      createMockTask("task-2", "テスト習慣2"),
    ];
    mockLoadTasks.mockReturnValue(mockTasks);
    
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.tasks).toEqual(mockTasks);
    expect(mockLoadTasks).toHaveBeenCalledTimes(1);
  });

  test("should add new task", () => {
    const { result } = renderHook(() => useTasks());
    const newTask = createMockTask("new-task", "新しい習慣");
    
    act(() => {
      result.current.addTask(newTask);
    });
    
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0]).toEqual(newTask);
    expect(mockSaveTasks).toHaveBeenCalledWith([newTask]);
  });

  test("should update existing task", () => {
    const initialTasks = [createMockTask("task-1", "元の習慣")];
    mockLoadTasks.mockReturnValue(initialTasks);
    
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.updateTask("task-1", {
        configuration: {
          ...initialTasks[0].configuration,
          content: "更新された習慣",
        },
      });
    });
    
    expect(result.current.tasks[0].configuration.content).toBe("更新された習慣");
    expect(mockSaveTasks).toHaveBeenCalled();
  });

  test("should delete task", () => {
    const initialTasks = [
      createMockTask("task-1", "削除される習慣"),
      createMockTask("task-2", "残る習慣"),
    ];
    mockLoadTasks.mockReturnValue(initialTasks);
    
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.deleteTask("task-1");
    });
    
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].configuration.id).toBe("task-2");
    expect(mockSaveTasks).toHaveBeenCalledWith([initialTasks[1]]);
  });

  test("should toggle task completion for existing instance", () => {
    const today = new Date();
    const initialTasks = [
      {
        configuration: {
          id: "task-1",
          content: "テスト習慣",
          frequency: { unit: "day", count: 1 },
          duration: { deadline: new Date("2024-12-31") },
          createdAt: new Date(),
        },
        instances: [
          {
            id: "instance-1",
            configurationId: "task-1",
            status: "not-started" as const,
            scheduledDate: today,
            createdAt: new Date(),
          },
        ],
      },
    ];
    mockLoadTasks.mockReturnValue(initialTasks);
    
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.toggleTask("task-1");
    });
    
    expect(result.current.tasks[0].instances[0].status).toBe("done");
    expect(result.current.tasks[0].instances[0].completedDate).toBeInstanceOf(Date);
    expect(mockSaveTasks).toHaveBeenCalled();
  });

  test("should create new instance when today instance does not exist", () => {
    const initialTasks = [
      {
        configuration: {
          id: "task-1",
          content: "テスト習慣",
          frequency: { unit: "day", count: 1 },
          duration: { deadline: new Date("2024-12-31") },
          createdAt: new Date(),
        },
        instances: [],
      },
    ];
    mockLoadTasks.mockReturnValue(initialTasks);
    
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.toggleTask("task-1");
    });
    
    expect(result.current.tasks[0].instances).toHaveLength(1);
    expect(result.current.tasks[0].instances[0].status).toBe("done");
    expect(result.current.tasks[0].instances[0].completedDate).toBeInstanceOf(Date);
    expect(mockSaveTasks).toHaveBeenCalled();
  });

  test("should toggle task completion back to not-started", () => {
    const today = new Date();
    const initialTasks = [
      {
        configuration: {
          id: "task-1",
          content: "テスト習慣",
          frequency: { unit: "day", count: 1 },
          duration: { deadline: new Date("2024-12-31") },
          createdAt: new Date(),
        },
        instances: [
          {
            id: "instance-1",
            configurationId: "task-1",
            status: "done" as const,
            scheduledDate: today,
            completedDate: today,
            createdAt: new Date(),
          },
        ],
      },
    ];
    mockLoadTasks.mockReturnValue(initialTasks);
    
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.toggleTask("task-1");
    });
    
    expect(result.current.tasks[0].instances[0].status).toBe("not-started");
    expect(result.current.tasks[0].instances[0].completedDate).toBeUndefined();
    expect(mockSaveTasks).toHaveBeenCalled();
  });

  test("should handle non-existent task for toggle", () => {
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.toggleTask("non-existent-task");
    });
    
    expect(result.current.tasks).toEqual([]);
    expect(mockSaveTasks).not.toHaveBeenCalled();
  });

  test("should handle non-existent task for update", () => {
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.updateTask("non-existent-task", {
        configuration: { content: "更新" } as any,
      });
    });
    
    expect(result.current.tasks).toEqual([]);
    // 存在しないタスクの更新でもsaveTasksは呼ばれる（空の配列で保存される）
    expect(mockSaveTasks).toHaveBeenCalledWith([]);
  });

  test("should handle non-existent task for delete", () => {
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.deleteTask("non-existent-task");
    });
    
    expect(result.current.tasks).toEqual([]);
    // 存在しないタスクの削除でもsaveTasksは呼ばれる（空の配列で保存される）
    expect(mockSaveTasks).toHaveBeenCalledWith([]);
  });

  test("should maintain task order after operations", () => {
    const initialTasks = [
      createMockTask("task-1", "習慣1"),
      createMockTask("task-2", "習慣2"),
      createMockTask("task-3", "習慣3"),
    ];
    mockLoadTasks.mockReturnValue(initialTasks);
    
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.deleteTask("task-2");
    });
    
    expect(result.current.tasks).toHaveLength(2);
    expect(result.current.tasks[0].configuration.id).toBe("task-1");
    expect(result.current.tasks[1].configuration.id).toBe("task-3");
  });
});
