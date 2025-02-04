export interface IPagination<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
