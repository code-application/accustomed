# ADR: TypeScript 設定ファイルの複数分割

## 実装日

2025 年 9 月 7 日

## 背景・課題

### 問題

- VSCode では複数の tsconfig.json を環境別に読み込ませることができない
- ビルド用、テスト用で別々に tsconfig を用意すると、IDE の表示で意図しない挙動になることがある
- 例：テスト用の tsconfig を分離（tsconfig.test.json など）し、tsconfig.json からテストコードを除外すると、パスエイリアスの設定などがテストコードの表示に反映されない

### 要件

- IDE での適切なシンタックスハイライトと補完機能
- ビルド時の厳密な型チェック（テストコード除外）
- テスト実行時の適切な型定義

## 決定事項

### TypeScript 設定ファイルの分割構成

1. **`tsconfig.build.json`** - ベース設定（ビルド用）

   - 基本的な TypeScript 設定
   - テストコードを除外
   - `noEmit: false`（ビルド用）

2. **`tsconfig.json`** - IDE 用設定

   - `tsconfig.build.json`を継承
   - `noEmit: true`（IDE 用）
   - テストコードも含む（IDE 表示用）

3. **`tsconfig.test.json`** - テスト用設定
   - `tsconfig.build.json`を継承
   - テスト専用の型定義を追加
   - テストファイルのみを対象

### 実装方法

#### ファイル構成

```
tsconfig.build.json  # ベース設定
├── tsconfig.json    # IDE用（extends tsconfig.build.json）
└── tsconfig.test.json # テスト用（extends tsconfig.build.json）
```

#### 実行時の設定指定

- **ビルド・開発**: 環境変数で`tsconfig.build.json`を指定
- **テスト**: 明示的に`tsconfig.test.json`を指定
- **IDE**: 自動的に`tsconfig.json`を参照

#### 環境変数設定

Windows、Mac 両方で実行可能にするため`cross-env`を使用：

```json
{
  "scripts": {
    "dev": "cross-env TS_NODE_PROJECT=tsconfig.build.json next dev",
    "build": "cross-env TS_NODE_PROJECT=tsconfig.build.json next build",
    "lint": "cross-env TS_NODE_PROJECT=tsconfig.build.json next lint",
    "test:type-check": "tsc --noEmit --project tsconfig.test.json"
  }
}
```

## 結果・影響

### メリット

- IDE での適切な型表示と補完機能
- ビルド時の厳密な型チェック
- テスト実行時の適切な型定義
- 設定の重複を避けられる
- 各環境に最適化された設定

### デメリット

- 設定ファイルが複数になり管理が複雑
- 環境変数の設定が必要
- `cross-env`パッケージの追加依存

### リスク

- 設定ファイル間の不整合
- 環境変数の設定忘れ

## 代替案

### 代替案 1: 単一 tsconfig.json

- **メリット**: シンプル
- **デメリット**:
  - IDE 表示の問題が解決されない
  - 本番ビルド用の資材の中にテストコードの設定も混入してしまう

### 代替案 2: IDE 用のみ分離

- **メリット**: 最小限の変更
- **デメリット**: ビルド時の厳密性が確保されない

## 関連資料

- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Next.js TypeScript Configuration](https://nextjs.org/docs/basic-features/typescript)
- [cross-env package](https://www.npmjs.com/package/cross-env)
