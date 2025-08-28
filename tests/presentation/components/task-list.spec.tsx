import { TaskList } from "@/presentation/components/task-list";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("TaskList", () => {
  test("should render empty task list", () => {
    render(
      <TaskList
        tasks={[]}
        onToggle={() => {}}
        onDelete={() => {}}
        onEdit={() => {}}
      />
    );
    expect(
      screen.getByText(
        "習慣がまだありません。「＋」ボタンをクリックして最初の習慣を作成してください。"
      )
    ).toBeDefined();
  });
});
