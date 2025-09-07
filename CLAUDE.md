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
- Lint: `npm run lint` (ESLint + Biome)
- Build: `npm run build`
- Format: `npm run format` (Biome)
- Docs Check: `npm run docs:check` (markdownlint)

## 開発ルール

- **コミットメッセージは日本語で書くこと**
- **バックログドキュメントの作成**:
  - 各issueの実装計画は必ず`docs/backlogs/issue-{番号}-{概要}.md`として文書化すること
  - 定型フォーマットに従い、手動フィードバック追記用のセクションを含めること
  - 会話に閉じず、永続的に参照可能な形で開発記録を保存すること
- **文書品質管理**:
  - Markdown文書を作成・更新した場合は`npm run docs:fix`を実行すること
  - コード変更後は`npm run check:fix`でBiomeフォーマット＋リントを実行すること
  - Biome（JS/TS/CSS/JSON）とmarkdownlint（Markdown）のハイブリッド構成を使用

## 品質基準

### 完了の定義（Definition of Done）

すべてのissueは以下の条件を満たすまで完了とはみなされない：

#### 必須条件

- [ ] すべての受け入れ条件を満たしている
- [ ] コードレビューが完了している（review-requiredラベルがある場合のみ）
- [ ] レイヤードアーキテクチャの依存関係を遵守している
- [ ] 単体テスト・統合テスト・E2Eテストがすべて通っている
- [ ] カバレッジが80%以上を維持している
- [ ] ドキュメントが更新されている
- [ ] パイプライン（lintとbuild）がすべてPASSしている
- [ ] セキュリティチェックが完了している
- [ ] パフォーマンス要件を満たしている

#### テスト要件

- **Unit Tests**: 主要ロジックの70-80%をカバー
- **Integration Tests**: コンポーネント間の連携を15-20%でカバー
- **E2E Tests**: 主要なユーザーフローを5-10%でカバー

#### 品質要件

- コードレビューでの指摘事項が全て解決済み
- TypeScriptの型安全性が保たれている
- アクセシビリティ要件を満たしている（該当する場合）
- 既存機能に影響がないことを確認済み
