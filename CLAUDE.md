# プロジェクト固有指示

## タスクワークフロー（必須手順）

GitHubプロジェクトでタスクに取り掛かる際は、以下の順番を厳守すること：

1. **Issue取得**: `gh issue list`でリモートリポジトリからissue一覧を取得
2. **Issue選択・アサイン**: ユーザーが選択したissueに`gh issue edit <番号> --add-assignee @me`で自分をアサイン
3. **計画立案**: Planモードで以下を実施
   - 現状調査・分析
   - 実装方針の決定
   - 具体的な実装手順の策定
4. **実装**: 計画に基づいてコード実装
5. **検証**: 動作確認・テスト実行
6. **完了処理**: コミット作成・プッシュ・PR作成・issue close

## 開発環境

- Next.js 13.5.1 + React 18.2.0 + TypeScript
- UI: shadcn/ui + Tailwind CSS
- 状態管理: React Hooks
- テスト: (要確認)
- Lint: `npm run lint`
- Build: `npm run build`

## 開発ルール

- **コミットメッセージは日本語で書くこと**
