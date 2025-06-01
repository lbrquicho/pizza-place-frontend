export interface AppState {
  data: any[];
  totalCount: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export const initialAppState: AppState = {
  data: [],
  totalCount: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  error: null,
};