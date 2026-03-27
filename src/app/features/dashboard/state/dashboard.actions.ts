import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DashboardInsightsDto, DashboardSummaryDto } from '../../../core/services/dashboard-api.service';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    Enter: emptyProps(),
    'Load All': emptyProps(),
    'Load Summary': emptyProps(),
    'Load Summary Success': props<{ summary: DashboardSummaryDto }>(),
    'Load Summary Failure': props<{ message: string }>(),
    'Load Insights': emptyProps(),
    'Load Insights Success': props<{ insights: DashboardInsightsDto }>(),
    'Load Insights Failure': props<{ message: string }>(),
    'Check Health': emptyProps(),
    'Check Health Success': props<{ ok: boolean }>(),
    'Check Health Failure': emptyProps(),
  },
});
