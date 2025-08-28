import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { TaskList } from "@/presentation/components/task-list";
import { Task } from "@/domain/task";

// モック関数
const mockOnToggle = vi.fn();
const mockOnDelete = vi.fn();
const mockOnEdit = vi.fn();

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

describe("TaskList", () => {
  test("should render empty task list message", () => {
    render(
      <TaskList
        tasks={[]}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(
      screen.getByText(
        "習慣がまだありません。「＋」ボタンをクリックして最初の習慣を作成してください。"
      )
    ).toBeInTheDocument();
  });

  test("should render task list with multiple tasks", () => {
    const tasks = [
      createMockTask("task-1", "読書習慣"),
      createMockTask("task-2", "運動習慣"),
      createMockTask("task-3", "学習習慣"),
    ];

    render(
      <TaskList
        tasks={tasks}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText("習慣一覧")).toBeInTheDocument();
    expect(screen.getByText("読書習慣")).toBeInTheDocument();
    expect(screen.getByText("運動習慣")).toBeInTheDocument();
    expect(screen.getByText("学習習慣")).toBeInTheDocument();
  });

  test("should render single task", () => {
    const tasks = [createMockTask("task-1", "単一習慣")];

    render(
      <TaskList
        tasks={tasks}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText("習慣一覧")).toBeInTheDocument();
    expect(screen.getByText("単一習慣")).toBeInTheDocument();
  });

  test("should not show empty message when tasks exist", () => {
    const tasks = [createMockTask("task-1", "テスト習慣")];

    render(
      <TaskList
        tasks={tasks}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(
      screen.queryByText(
        "習慣がまだありません。「＋」ボタンをクリックして最初の習慣を作成してください。"
      )
    ).not.toBeInTheDocument();
  });

  test("should render task cards with correct props", () => {
    const tasks = [createMockTask("task-1", "テスト習慣")];

    render(
      <TaskList
        tasks={tasks}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    // TaskCardコンポーネントが正しく表示されることを確認
    expect(screen.getByText("テスト習慣")).toBeInTheDocument();
    expect(screen.getByText("日1回")).toBeInTheDocument();
  });

  test("should handle tasks with different frequencies", () => {
    const tasks: Task[] = [
      {
        configuration: {
          id: "task-1",
          content: "日次習慣",
          frequency: { unit: "day", count: 1 },
          duration: { deadline: new Date("2024-12-31") },
          createdAt: new Date(),
        },
        instances: [],
      },
      {
        configuration: {
          id: "task-2",
          content: "週次習慣",
          frequency: { unit: "week", count: 2 },
          duration: { deadline: new Date("2024-12-31") },
          createdAt: new Date(),
        },
        instances: [],
      },
      {
        configuration: {
          id: "task-3",
          content: "月次習慣",
          frequency: { unit: "month", count: 1 },
          duration: { deadline: new Date("2024-12-31") },
          createdAt: new Date(),
        },
        instances: [],
      },
    ];

    render(
      <TaskList
        tasks={tasks}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText("日次習慣")).toBeInTheDocument();
    expect(screen.getByText("週次習慣")).toBeInTheDocument();
    expect(screen.getByText("月次習慣")).toBeInTheDocument();
    expect(screen.getByText("日1回")).toBeInTheDocument();
    expect(screen.getByText("週2回")).toBeInTheDocument();
    expect(screen.getByText("月1回")).toBeInTheDocument();
  });

  test("should render tasks with completed instances", () => {
    const today = new Date();
    const tasks: Task[] = [
      {
        configuration: {
          id: "task-1",
          content: "完了済み習慣",
          frequency: { unit: "day", count: 1 },
          duration: { deadline: new Date("2024-12-31") },
          createdAt: new Date(),
        },
        instances: [
          {
            id: "instance-1",
            configurationId: "task-1",
            status: "done",
            scheduledDate: today,
            completedDate: today,
            createdAt: new Date(),
          },
        ],
      },
    ];

    render(
      <TaskList
        tasks={tasks}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText("完了済み習慣")).toBeInTheDocument();
    expect(screen.getByText("完了済み")).toBeInTheDocument();
  });
});
