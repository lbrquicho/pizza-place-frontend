import { createAction, props } from "@ngrx/store";

export const getOrders = createAction(
  '[APP] Get Orders',
  props<{ searchKey?: string; page?: number; pageSize?: number; orderBy?: string; order?: string }>()
);

export const getOrdersSuccess = createAction(
  '[APP] Get Orders Success',
  props<{ data: any[]; totalCount: number }>()
);

export const getOrdersFailure = createAction(
  '[APP] Get Orders Failure',
  props<{ error: string }>()
);