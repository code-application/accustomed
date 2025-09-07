// 共通の技術的型定義
// ドメインに依存しない技術的な型のみを定義

export type StringId = string;
export type Timestamp = number;

// APIレスポンス等の共通型（将来の拡張用）
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
