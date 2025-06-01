import { createReducer, on } from "@ngrx/store";
import { initialAppState } from "./app.state";
import * as AppActions from './app.actions';

export const appReducer = createReducer(
  initialAppState,
  on(AppActions.getOrders, (state, action) => ({
    ...state,
    loading: true,
    error: null,
    page: action.page ?? state.page,
    pageSize: action.pageSize ?? state.pageSize,
  })),
  on(AppActions.getOrdersSuccess, (state, { data, totalCount }) => ({
    ...state,
    data,
    totalCount,
    loading: false,
  })),
  on(AppActions.getOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);