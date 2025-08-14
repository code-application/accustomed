# アプリケーションサービス 関数構成図

## 概要

Reactフックとアプリケーションレイヤーの関数群を示す構成図です。
実装は関数型アプローチを採用しており、オブジェクト指向のクラスではなく個別の関数として構成されています。

## メインのReactカスタムフック

```mermaid
classDiagram
    class useTasksHook {
        <<custom hook>>
        -tasks: Task[]
        -isLoading: boolean
        -setTasks(tasks: Task[]) void
        +addTask(task: Task) void
        +updateTask(taskId: string, updates: Partial~Task~) void
        +deleteTask(taskId: string) void
        +toggleTask(taskId: string) void
    }

    class TasksReturnType {
        <<type>>
        +tasks: Task[]
        +isLoading: boolean
        +addTask: Function
        +updateTask: Function
        +deleteTask: Function
        +toggleTask: Function
    }

    %% 戻り値の型関係
    useTasksHook --> TasksReturnType : returns

    %% 依存関係
    useTasksHook ..> Task : manages
    useTasksHook --> LocalStorageFunctions : uses
    useTasksHook --> TaskUtilityFunctions : uses
```

## タスクユーティリティ関数群

```mermaid
classDiagram
    class TaskUtilityFunctions {
        <<function module>>
        +generateTaskConfigurationId() string
        +generateTaskInstanceId() string
        +generateTaskInstance(config: TaskConfiguration) TaskInstance
        +isTaskInstanceCompletedToday(instance: TaskInstance) boolean
        +isSameDate(date1: Date|string, date2: Date|string) boolean
        +toggleTaskInstanceCompletion(instance: TaskInstance) TaskInstance
        +createTaskInstance(configId: string, scheduledDate: Date) TaskInstance
        +toggleTaskInstanceCompletionById(task: Task, instanceId: string) Task
    }

    class TaskStatsFunctions {
        <<function module>>
        +calculateNewTaskStats(tasks: Task[]) TaskStats
        +getWeeklyInstances(task: Task, startDate: Date) TaskInstance[]
        +getMonthlyInstances(task: Task, year: number, month: number) TaskInstance[]
        +calculateRemainingDays(task: Task) number
    }

    class TaskHistoryFunctions {
        <<function module>>
        +formatMonthlyHistoryData(task: Task, year: number, month: number) MonthlyHistoryData
        +formatWeeklyData(task: Task, startDate: Date) WeeklyData
    }

    %% 依存関係
    TaskUtilityFunctions ..> TaskConfiguration : uses
    TaskUtilityFunctions ..> TaskInstance : uses
    TaskUtilityFunctions ..> Task : uses
    TaskStatsFunctions ..> Task : uses
    TaskStatsFunctions ..> TaskStats : creates
    TaskHistoryFunctions ..> Task : uses
    TaskHistoryFunctions ..> MonthlyHistoryData : creates
    TaskHistoryFunctions ..> WeeklyData : creates
    TaskStatsFunctions --> DateUtilityFunctions : depends on
    TaskHistoryFunctions --> DateUtilityFunctions : depends on
```

## 関数間の依存関係

```mermaid
classDiagram
    class useTasksHook {
        <<custom hook>>
        +addTask(task: Task) void
        +updateTask(taskId: string, updates: Partial~Task~) void
        +deleteTask(taskId: string) void
        +toggleTask(taskId: string) void
    }

    class LocalStorageFunctions {
        <<function module>>
        +saveTasks(tasks: Task[]) void
        +loadTasks() Task[]
        +clearTasks() void
    }

    class TaskUtilityFunctions {
        <<function module>>
        +createTaskInstance(configId: string, date: Date) TaskInstance
        +toggleTaskInstanceCompletionById(task: Task, id: string) Task
        +isSameDate(date1: Date, date2: Date) boolean
    }

    %% 使用関係
    useTasksHook --> LocalStorageFunctions : calls functions
    useTasksHook --> TaskUtilityFunctions : calls functions

    %% データ処理の流れ
    useTasksHook ..> Task : manages state
    LocalStorageFunctions ..> Task : serializes/deserializes
    TaskUtilityFunctions ..> Task : transforms
```

## 実装ファイル対応表

| 関数群・フック        | 実装ファイル               | 主要関数                                                                      |
| --------------------- | -------------------------- | ----------------------------------------------------------------------------- |
| useTasksHook          | `/src/hooks/useTasks.ts`   | addTask, updateTask, deleteTask, toggleTask                                   |
| TaskUtilityFunctions  | `/src/lib/taskUtils.ts`    | generateTaskConfigurationId, createTaskInstance, toggleTaskInstanceCompletion |
| TaskStatsFunctions    | `/src/lib/taskUtils.ts`    | calculateNewTaskStats, getWeeklyInstances, getMonthlyInstances                |
| TaskHistoryFunctions  | `/src/lib/taskUtils.ts`    | formatMonthlyHistoryData, formatWeeklyData                                    |
| LocalStorageFunctions | `/src/lib/localStorage.ts` | saveTasks, loadTasks, clearTasks                                              |

## 使用パターン

### タスクの追加フロー

1. UIコンポーネントがuseTasks().addTask()を呼び出し
2. addTask関数がLocalStorageFunctions.saveTasks()でデータを永続化
3. ReactのuseStateでUIが更新される

### タスクの完了切り替えフロー

1. UIコンポーネントがuseTasks().toggleTask()を呼び出し
2. toggleTask関数がTaskUtilityFunctions.createTaskInstanceまたはtoggleTaskInstanceCompletionByIdを使用
3. 更新されたタスクをLocalStorageFunctions.saveTasks()で保存

## 設計上の特徴

- **関数型設計**: クラスベースではなく、個別の純粋関数として実装
- **カスタムフック**: useTasksでReactの状態管理とビジネスロジックを分離
- **モジュール化**: 機能別に関数をグループ化（Utils, Stats, History, Storage）
- **依存性注入**: 各関数は必要なデータのみを引数として受け取る
- **副作用の分離**: 状態変更はuseTasksフック内、純粋な変換処理はユーティリティ関数内
