import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "./app.state";

export const selectAppState = createFeatureSelector<AppState>('app');

export const selectOrdersData = createSelector(selectAppState, (state) => state.data);
export const selectOrdersTotalCount = createSelector(selectAppState, (state) => state.totalCount);
export const selectOrdersLoading = createSelector(selectAppState, (state) => state.loading);
export const selectOrdersError = createSelector(selectAppState, (state) => state.error);