import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.reducer';

export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

export const selectDashboardSummary = createSelector(
  selectDashboardState,
  (s) => s.summary,
);
export const selectDashboardInsights = createSelector(selectDashboardState, (s) => s.insights);
export const selectDashboardInsightsError = createSelector(selectDashboardState, (s) => s.insightsError);
export const selectDashboardApiHealthy = createSelector(selectDashboardState, (s) => s.apiHealthy);

export const selectDashboardStatus = createSelector(selectDashboardState, (s) => s.status);

export const selectDashboardError = createSelector(selectDashboardState, (s) => s.error);

export const selectDashboardVm = createSelector(selectDashboardState, (s) => ({
  status: s.status,
  summary: s.summary,
  insights: s.insights,
  insightsError: s.insightsError,
  apiHealthy: s.apiHealthy,
  error: s.error,
}));
