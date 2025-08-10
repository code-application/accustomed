# ドメインモデル クラス図

## 概要

タスク管理アプリケーションの中核となるドメインエンティティと値オブジェクトの関係を示すクラス図です。

## ドメインエンティティとその関係

```mermaid
classDiagram
    class Task {
        +TaskConfiguration configuration
        +TaskInstance[] instances
    }

    class TaskConfiguration {
        +string id
        +string content
        +TaskFrequency frequency
        +TaskDuration duration
        +Date createdAt
    }

    class TaskInstance {
        +string id
        +string configurationId
        +TaskStatus status
        +Date scheduledDate
        +Date? completedDate
        +Date createdAt
    }

    class TaskFrequency {
        +FrequencyUnit unit
        +number count
    }

    class TaskDuration {
        +Date deadline
    }

    class TaskStats {
        +number totalTasks
        +number completedToday
        +number currentStreak
        +number totalCompletions
        +number completionRate
    }

    Task "1" *-- "1" TaskConfiguration : contains
    Task "1" *-- "0..*" TaskInstance : has
    TaskConfiguration "1" *-- "1" TaskFrequency : has
    TaskConfiguration "1" *-- "1" TaskDuration : has
```

## 列挙型とその値

```mermaid
classDiagram
    class TaskStatus {
        <<enumeration>>
        NOT_STARTED
        IN_PROGRESS
        DONE
    }

    class FrequencyUnit {
        <<enumeration>>
        DAY
        WEEK
        MONTH
    }

    TaskInstance "0..*" --> "1" TaskStatus : has
    TaskFrequency "0..*" --> "1" FrequencyUnit : uses
```

## 履歴・統計関連の値オブジェクト

```mermaid
classDiagram
    class WeeklyData {
        +Date startDate
        +WeeklyDayData[] days
        +number totalCompletions
    }

    class WeeklyDayData {
        +Date date
        +boolean isCompleted
        +boolean isToday
    }

    class MonthlyHistoryData {
        +number year
        +number month
        +DayData[] days
        +number totalCompletions
    }

    class DayData {
        +Date date
        +boolean isCompleted
        +number? completionCount
        +boolean isCurrentMonth
        +boolean isToday
    }

    WeeklyData "1" *-- "7" WeeklyDayData : contains
    MonthlyHistoryData "1" *-- "28..42" DayData : contains
```

## 実装ファイル対応表

| クラス/インターフェース | 実装ファイル          | 行数  |
| ----------------------- | --------------------- | ----- |
| TaskConfiguration       | `/src/types/index.ts` | 6-12  |
| TaskInstance            | `/src/types/index.ts` | 19-26 |
| Task                    | `/src/types/index.ts` | 32-35 |
| TaskFrequency           | `/src/types/index.ts` | 37-40 |
| TaskDuration            | `/src/types/index.ts` | 42-44 |
| TaskStatus              | `/src/types/index.ts` | 46    |
| FrequencyUnit           | `/src/types/index.ts` | 47    |
| TaskStats               | `/src/types/index.ts` | 49-55 |
| WeeklyData              | `/src/types/index.ts` | 57-61 |
| WeeklyDayData           | `/src/types/index.ts` | 63-67 |
| MonthlyHistoryData      | `/src/types/index.ts` | 69-74 |
| DayData                 | `/src/types/index.ts` | 76-82 |

## 設計上の注意点

- **Task**は集約ルートとして、TaskConfigurationとTaskInstance[]を管理
- **TaskInstance**は特定の日付に対するタスクの実行状況を表現
- **TaskConfiguration**はタスクの設定情報を不変オブジェクトとして管理
- 値オブジェクトは不変性を保ち、ビジネスルールを内包
