# 習慣トラッカー (Accustomed)

毎日の習慣を記録・管理するWebアプリケーションです。習慣化をサポートし、継続的な成長を促進します。

**🌐 [デモサイト](https://code-application.github.io/accustomed/)**

シンプルで直感的なインターフェースにより、習慣の追加から日々のトラッキング、進捗の可視化まで、習慣化に必要な機能を提供します。

## 📋 ユーザー向けの情報

### 主要機能

- **📝 習慣管理**: 新しい習慣の追加、既存習慣の編集・削除
- **✅ 日々のチェック**: 毎日の習慣完了状況を簡単にトラッキング
- **📊 統計ダッシュボード**: 
  - 今日の完了数と総数
  - 連続記録（ストリーク）
  - 完了率の表示
  - 総完了数の追跡
- **📈 進捗の可視化**: チャートとグラフによる視覚的な進捗表示
- **⏰ 柔軟な設定**: 日次、週次、月次、年次の頻度設定
- **📅 期間管理**: 習慣の継続期間を設定・管理
- **💾 データ保存**: ブラウザのローカルストレージにデータを保存

### 使い方

1. **習慣を追加**: 「習慣を追加」ボタンから新しい習慣を作成
2. **頻度を設定**: 日次、週次など、あなたに合った頻度を選択
3. **日々のチェック**: 習慣を実行したらチェックボックスをクリック
4. **進捗を確認**: ダッシュボードで統計情報や進捗グラフを確認

## 🛠️ 開発者向けの情報

### セットアップ手順

#### 前提条件
- Node.js 18.0.0以上
- npm

#### インストールと起動

1. **リポジトリをクローン**
```bash
git clone https://github.com/code-application/accustomed.git
cd accustomed
```

2. **依存関係をインストール**
```bash
npm install
```

3. **開発サーバーを起動**
```bash
npm run dev
```

4. **ブラウザでアクセス**
[http://localhost:3000](http://localhost:3000) を開く

#### 利用可能なスクリプト

```bash
npm run dev    # 開発サーバーの起動
npm run build  # 本番用ビルド
npm run start  # 本番サーバーの起動
npm run lint   # ESLintによるコードチェック
```

### 技術スタック

#### フロントエンド
- **Next.js 13.5.1** (App Router)
- **React 18.2.0**
- **TypeScript 5.2.2**

#### UI・スタイリング
- **Tailwind CSS** - ユーティリティファーストCSSフレームワーク
- **shadcn/ui** - Radix UIベースのコンポーネントライブラリ
- **Radix UI** - アクセシブルなプリミティブコンポーネント
- **Lucide React** - アイコンライブラリ

#### 主要ライブラリ
- **React Hook Form** - フォーム管理
- **Zod** - スキーマ検証
- **date-fns** - 日付処理
- **Recharts** - チャート・グラフ

### プロジェクト構造

```
├── app/                    # Next.js App Router
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # メインページ
├── components/            # Reactコンポーネント
│   ├── add-task-modal.tsx # タスク追加モーダル
│   ├── dashboard.tsx      # ダッシュボード
│   ├── task-card.tsx      # タスクカード
│   ├── task-list.tsx      # タスクリスト
│   └── ui/               # shadcn/uiコンポーネント
├── hooks/                # カスタムフック
│   ├── use-toast.ts      # トースト通知
│   └── useTasks.ts       # タスク管理
├── lib/                  # ユーティリティ関数
│   ├── dateUtils.ts      # 日付処理
│   ├── localStorage.ts   # ローカルストレージ管理
│   ├── taskUtils.ts      # タスク関連ユーティリティ
│   └── utils.ts          # 共通ユーティリティ
└── types/                # TypeScript型定義
    └── index.ts          # Task, TaskStats等の型
```

### コントリビューション

プルリクエストやイシューの報告を歓迎します。

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成
