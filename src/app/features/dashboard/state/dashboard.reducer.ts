import { createReducer, on } from '@ngrx/store';
import { DashboardInsightsDto, DashboardSummaryDto } from '../../../core/services/dashboard-api.service';
import { DashboardActions } from './dashboard.actions';

export type DashboardStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface DashboardState {
  status: DashboardStatus;
  summary: DashboardSummaryDto | null;
  insights: DashboardInsightsDto | null;
  insightsError: string | null;
  apiHealthy: boolean | null;
  error: string | null;
}

export const initialDashboardState: DashboardState = {
  status: 'idle',
  summary: null,
  insights: null,
  insightsError: null,
  apiHealthy: null,
  error: null,
};

export const dashboardReducer = createReducer(
  initialDashboardState,
  on(DashboardActions.enter, (state) => ({
    ...state,
    error: null,
    insightsError: null,
  })),
  on(DashboardActions.loadAll, (state): DashboardState => ({
    ...state,
    status: 'loading',
    error: null,
    insightsError: null,
  })),
  on(DashboardActions.loadSummary, (state): DashboardState => ({
    ...state,
    status: 'loading',
    error: null,
  })),
  on(DashboardActions.loadSummarySuccess, (state, { summary }): DashboardState => ({
    ...state,
    status: 'loaded',
    summary,
    error: null,
  })),
  on(DashboardActions.loadSummaryFailure, (state, { message }): DashboardState => ({
    ...state,
    status: 'error',
    error: message,
  })),
  on(DashboardActions.loadInsightsSuccess, (state, { insights }): DashboardState => ({
    ...state,
    insights,
    insightsError: null,
  })),
  on(DashboardActions.loadInsightsFailure, (state, { message }): DashboardState => ({
    ...state,
    insightsError: message,
  })),
  on(DashboardActions.checkHealthSuccess, (state, { ok }): DashboardState => ({
    ...state,
    apiHealthy: ok,
  })),
  on(DashboardActions.checkHealthFailure, (state): DashboardState => ({
    ...state,
    apiHealthy: false,
  })),
);
