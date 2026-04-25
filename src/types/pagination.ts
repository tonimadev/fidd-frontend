export interface OffsetResponse<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
}

export interface CursorResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasNextPage: boolean;
}
