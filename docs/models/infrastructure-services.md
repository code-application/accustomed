# インフラストラクチャサービス 関数構成図

## 概要

データ永続化とインフラストラクチャ関連の関数群を示す構成図です。
実装は関数ベースであり、クラス設計ではなく個別の関数として構成されています。

## データ永続化関数群

```mermaid
classDiagram
    class LocalStorageFunctions {
        <<function module>>
        +saveTasks(tasks: Task[]) void
        +loadTasks() Task[]
        +clearTasks() void
    }

    class TaskSerializationLogic {
        <<internal logic>>
        -restoreDateObjects(taskData: any) Task
        -serializeToJSON(tasks: Task[]) string
        -deserializeFromJSON(data: string) Task[]
    }

    class BrowserStorageAPI {
        <<external api>>
        +localStorage.setItem(key: string, value: string) void
        +localStorage.getItem(key: string) string|null
        +localStorage.removeItem(key: string) void
    }

    %% 使用関係
    LocalStorageFunctions --> BrowserStorageAPI : uses
    LocalStorageFunctions --> TaskSerializationLogic : uses internally

    %% 依存関係
    LocalStorageFunctions ..> Task : serializes/deserializes
    LocalStorageFunctions ..> TaskConfiguration : restores
    LocalStorageFunctions ..> TaskInstance : restores
```

## 日付ユーティリティ関数群

```mermaid
classDiagram
    class DateUtilityFunctions {
        <<function module>>
        +formatDate(date: Date) string
        +isDateToday(dateString: string) boolean
        +getCurrentDateString() string
        +calculateStreak(completedDates: string[]) number
        +getWeeklyProgress(completedDates: string[]) number[]
        +getEndOfMonthExample() string
        +getDaysInMonth(year: number, month: number) number
        +getWeekStart(date: Date) Date
        +isCurrentWeek() boolean
        +isCurrentMonth(year: number, month: number) boolean
        +isSameDate(d1: Date, d2: Date) boolean
        +getMonthName(year: number, month: number) string
    }

    class DateFnsLibrary {
        <<external library>>
        +format(date: Date, format: string) string
        +isToday(date: Date) boolean
        +parseISO(dateString: string) Date
        +differenceInDays(date1: Date, date2: Date) number
        +startOfDay(date: Date) Date
    }

    %% 依存関係
    DateUtilityFunctions --> DateFnsLibrary : uses
    DateUtilityFunctions ..> Date : manipulates
```

## エラーハンドリング戦略

```mermaid
classDiagram
    class ErrorHandling {
        <<error handling>>
        +handleJSONParseError(error: Error) Task[]
        +handleStorageUnavailable() Task[]
        +logError(message: string, error: Error) void
    }

    class FallbackStrategy {
        <<fallback>>
        +returnEmptyArray() Task[]
        +useDefaultValue() any
    }

    %% エラー処理の流れ
    LocalStorageFunctions --> ErrorHandling : delegates to
    ErrorHandling --> FallbackStrategy : uses
```

## インフラストラクチャ関数群の相互関係

```mermaid
classDiagram
    class LocalStorageFunctions {
        <<function module>>
        +saveTasks(tasks: Task[]) void
        +loadTasks() Task[]
        +clearTasks() void
    }

    class DateUtilityFunctions {
        <<function module>>
        +isDateToday(dateString: string) boolean
        +calculateStreak(dates: string[]) number
        +getDaysInMonth(year: number, month: number) number
        +isSameDate(d1: Date, d2: Date) boolean
    }

    class TaskUtilityFunctions {
        <<function module>>
        +generateTaskConfigurationId() string
        +generateTaskInstanceId() string
        +createTaskInstance(configId: string, date: Date) TaskInstance
    }

    %% 関数間の依存
    LocalStorageFunctions --> DateUtilityFunctions : date restoration
    TaskUtilityFunctions --> DateUtilityFunctions : date calculations
```

## データシリアライゼーション詳細

```mermaid
flowchart TD
    A[Task Objects] --> B[JSON.stringify]
    B --> C[localStorage.setItem]

    D[localStorage.getItem] --> E[JSON.parse]
    E --> F[Date Object Restoration]
    F --> G[Restored Task Objects]

    subgraph "Serialization Process"
        A
        B
        C
    end

    subgraph "Deserialization Process"
        D
        E
        F
        G
    end

    subgraph "Date Field Restoration"
        F1[configuration.createdAt]
        F2[configuration.duration.deadline]
        F3[configuration.duration.startedAt]
        F4[instances[].scheduledDate]
        F5[instances[].completedDate]
        F6[instances[].createdAt]

        F --> F1
        F --> F2
        F --> F3
        F --> F4
        F --> F5
        F --> F6
    end
```

## 実装ファイル対応表

| 関数群                | 実装ファイル               | 主要関数                                            | 行数  |
| --------------------- | -------------------------- | --------------------------------------------------- | ----- |
| LocalStorageFunctions | `/src/lib/localStorage.ts` | saveTasks, loadTasks, clearTasks                    | 1-62  |
| DateUtilityFunctions  | `/src/lib/dateUtils.ts`    | formatDate, isDateToday, calculateStreak, etc       | 1-180 |
| TaskUtilityFunctions  | `/src/lib/taskUtils.ts`    | generateTaskConfigurationId, generateTaskInstanceId | 17-29 |

## 設計上の注意点

### ブラウザ環境の考慮

- **SSR対応**: `typeof window !== "undefined"` チェックでサーバーサイドレンダリングに対応
- **localStorage可用性**: ブラウザ環境でのみlocalStorageを使用

### データ整合性の保証

- **Date復元処理**: JSONシリアライゼーション時にDateオブジェクトが文字列になるため、復元時に明示的にDateオブジェクトに変換
- **エラーハンドリング**: 不正なデータが保存されていてもアプリケーションが停止しないよう、フォールバック値（空配列）を提供

### パフォーマンス考慮

- **同期処理**: localStorageは同期APIのため、大量データでのブロッキングに注意
- **メモリ効率**: 不要なオブジェクトコピーを避けたDate復元処理
