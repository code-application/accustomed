# プレゼンテーション層 クラス図

## 概要

React コンポーネントとプレゼンテーション層の構造を示すクラス図です。

## メインコンポーネント階層

```mermaid
classDiagram
    class PageComponent {
        -useTasks() TasksHookResult
        +render() JSX.Element
        +handleAddTask(task: Task) void
        +handleUpdateTask(taskId: string, updates: Partial~Task~) void
        +handleDeleteTask(taskId: string) void
        +handleToggleTask(taskId: string) void
    }

    class TaskList {
        +tasks: Task[]
        +onToggle: (taskId: string) => void
        +onDelete: (taskId: string) => void
        +onEdit: (task: Task) => void
        +render() JSX.Element
    }

    class TaskCard {
        +task: Task
        +onToggle: (taskId: string) => void
        +onDelete: (taskId: string) => void
        +onEdit: (task: Task) => void
        -showMonthlyCalendar: boolean
        -setShowMonthlyCalendar: (show: boolean) => void
        +render() JSX.Element
        +handleViewToggle() void
        +calculateTaskStats() TaskDisplayStats
    }

    class AddTaskModal {
        +isOpen: boolean
        +onClose: () => void
        +onSubmit: (task: Task) => void
        +editingTask?: Task
        -content: string
        -frequencyUnit: FrequencyUnit
        -frequencyCount: number
        -deadline: string
        +render() JSX.Element
        +handleSubmit() void
        +resetForm() void
    }

    %% 階層関係
    PageComponent "1" *-- "0..*" TaskList : contains
    PageComponent "1" *-- "1" AddTaskModal : contains
    TaskList "1" *-- "0..*" TaskCard : renders

    %% データフロー
    PageComponent --> TaskList : passes tasks & handlers
    PageComponent --> AddTaskModal : passes handlers
    TaskList --> TaskCard : passes task & handlers
```

## 表示・履歴コンポーネント

```mermaid
classDiagram
    class WeeklyProgress {
        +task: Task
        +onToggle: (taskId: string) => void
        +render() JSX.Element
        +generateWeeklyData() WeeklyData
        +handleTodayToggle() void
    }

    class MonthlyHistory {
        +task: Task
        +onToggle: (taskId: string) => void
        +onClose: () => void
        -currentDate: Date
        -setCurrentDate: (date: Date) => void
        +render() JSX.Element
        +generateMonthlyData() MonthlyHistoryData
        +handleMonthNavigation(direction: 'prev' | 'next') void
        +handleDayClick(dayData: DayData) void
    }

    class DateGrid {
        +weekDayLabels: string[]
        +days: DayData[]
        +onDayClick?: (dayData: DayData) => void
        +formatDate?: (date: Date) => string
        +showCompletionIcon?: boolean
        +className?: string
        +isClickable?: (dayData: DayData) => boolean
        +getDayStyle?: (dayData: DayData) => string
        +render() JSX.Element
    }

    class Dashboard {
        +tasks: Task[]
        +render() JSX.Element
        +calculateDashboardStats() TaskStats
    }

    %% 使用関係
    TaskCard "1" *-- "1" WeeklyProgress : conditionally renders
    TaskCard "1" *-- "1" MonthlyHistory : conditionally renders
    WeeklyProgress "1" *-- "1" DateGrid : uses
    MonthlyHistory "1" *-- "1" DateGrid : uses

    %% 依存関係
    WeeklyProgress ..> WeeklyData : creates
    MonthlyHistory ..> MonthlyHistoryData : creates
    DateGrid ..> DayData : renders
```

## Props インターフェース

```mermaid
classDiagram
    class TaskListProps {
        +tasks: Task[]
        +onToggle: (taskId: string) => void
        +onDelete: (taskId: string) => void
        +onEdit: (task: Task) => void
    }

    class TaskCardProps {
        +task: Task
        +onToggle: (taskId: string) => void
        +onDelete: (taskId: string) => void
        +onEdit: (task: Task) => void
    }

    class AddTaskModalProps {
        +isOpen: boolean
        +onClose: () => void
        +onSubmit: (task: Task) => void
        +editingTask?: Task
    }

    class WeeklyProgressProps {
        +task: Task
        +onToggle: (taskId: string) => void
    }

    class MonthlyHistoryProps {
        +task: Task
        +onToggle: (taskId: string) => void
        +onClose: () => void
    }

    class DateGridProps {
        +weekDayLabels: string[]
        +days: DayData[]
        +onDayClick?: (dayData: DayData) => void
        +formatDate?: (date: Date) => string
        +showCompletionIcon?: boolean
        +className?: string
        +isClickable?: (dayData: DayData) => boolean
        +getDayStyle?: (dayData: DayData) => string
    }

    class DashboardProps {
        +tasks: Task[]
    }

    %% 実装関係
    TaskList ..|> TaskListProps : implements
    TaskCard ..|> TaskCardProps : implements
    AddTaskModal ..|> AddTaskModalProps : implements
    WeeklyProgress ..|> WeeklyProgressProps : implements
    MonthlyHistory ..|> MonthlyHistoryProps : implements
    DateGrid ..|> DateGridProps : implements
    Dashboard ..|> DashboardProps : implements
```

## React フックとの連携

```mermaid
classDiagram
    class useTasksHook {
        -tasks: Task[]
        -isLoading: boolean
        +addTask(task: Task) void
        +updateTask(taskId: string, updates: Partial~Task~) void
        +deleteTask(taskId: string) void
        +toggleTask(taskId: string) void
        +getTasks() Task[]
        +getIsLoading() boolean
    }

    class useToastHook {
        +toast(options: ToastOptions) void
        +success(message: string) void
        +error(message: string) void
        +dismiss(id?: string) void
    }

    class PageComponent {
        -tasksHook: useTasksHook
        -toast: useToastHook
        +render() JSX.Element
    }

    class TaskCard {
        -showMonthlyCalendar: boolean
        +handleToggle() void
        +handleEdit() void
        +handleDelete() void
    }

    class AddTaskModal {
        -content: string
        -frequencyUnit: FrequencyUnit
        -frequencyCount: number
        -deadline: string
        +handleFormSubmit() void
    }

    class MonthlyHistory {
        -currentDate: Date
        +handleMonthChange(direction: string) void
    }

    class ReactUseState {
        +useState(initialValue: any) [value, setValue]
    }

    %% フック使用関係
    PageComponent --> useTasksHook : uses
    PageComponent --> useToastHook : uses
    TaskCard --> ReactUseState : uses
    AddTaskModal --> ReactUseState : uses (multiple)
    MonthlyHistory --> ReactUseState : uses
```

## イベントハンドリングフロー

```mermaid
sequenceDiagram
    participant UI as User Interface
    participant TC as TaskCard
    participant TL as TaskList
    participant PC as PageComponent
    participant TH as useTasksHook
    participant LS as LocalStorage

    UI->>TC: クリック (タスク完了切り替え)
    TC->>TL: onToggle(taskId)
    TL->>PC: onToggle(taskId)
    PC->>TH: toggleTask(taskId)
    TH->>LS: saveTasks(updatedTasks)
    LS-->>TH: 保存完了
    TH-->>PC: state更新
    PC-->>TL: re-render with new tasks
    TL-->>TC: re-render with updated task
    TC-->>UI: UI更新表示
```

## 実装ファイル対応表

| コンポーネント | 実装ファイル                          | 主要機能                     | 状態管理               |
| -------------- | ------------------------------------- | ---------------------------- | ---------------------- |
| PageComponent  | `/src/app/page.tsx`                   | アプリのルートコンポーネント | useTasks フック        |
| TaskList       | `/src/components/task-list.tsx`       | タスクリスト表示             | なし（props only）     |
| TaskCard       | `/src/components/task-card.tsx`       | 個別タスク表示・操作         | showMonthlyCalendar    |
| AddTaskModal   | `/src/components/add-task-modal.tsx`  | タスク追加・編集フォーム     | フォーム状態           |
| WeeklyProgress | `/src/components/weekly-progress.tsx` | 週間進捗表示                 | なし（props only）     |
| MonthlyHistory | `/src/components/monthly-history.tsx` | 月間履歴表示                 | currentDate            |
| DateGrid       | `/src/components/date-grid.tsx`       | 汎用日付グリッド             | なし（pure component） |
| Dashboard      | `/src/components/dashboard.tsx`       | 統計ダッシュボード           | なし（未使用）         |

## 設計上の特徴

- **単一責任の原則**: 各コンポーネントは明確な役割を持つ
- **Props による依存性注入**: イベントハンドラーは props として注入
- **状態の上昇**: 共有状態は useTasks フックで一元管理
- **コンポーネントの再利用性**: DateGrid は週間・月間表示で共用
- **条件付きレンダリング**: TaskCard 内で WeeklyProgress/MonthlyHistory を切り替え
