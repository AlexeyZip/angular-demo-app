import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TraceExecution } from '../../../core/meta/trace.decorator';
import { DashboardInsightsDto, DashboardSummaryDto } from '../../../core/services/dashboard-api.service';
import { DashboardActions } from './dashboard.actions';
import { DashboardStatus } from './dashboard.reducer';
import {
  selectDashboardApiHealthy,
  selectDashboardError,
  selectDashboardInsights,
  selectDashboardInsightsError,
  selectDashboardStatus,
  selectDashboardSummary,
} from './dashboard.selectors';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly store = inject(Store);

  readonly summary$: Observable<DashboardSummaryDto | null> = this.store.select(
    selectDashboardSummary,
  );
  readonly insights$: Observable<DashboardInsightsDto | null> = this.store.select(selectDashboardInsights);
  readonly status$: Observable<DashboardStatus> = this.store.select(selectDashboardStatus);
  readonly error$: Observable<string | null> = this.store.select(selectDashboardError);
  readonly insightsError$: Observable<string | null> = this.store.select(selectDashboardInsightsError);
  readonly apiHealthy$: Observable<boolean | null> = this.store.select(selectDashboardApiHealthy);

  enter(): void {
    this.store.dispatch(DashboardActions.enter());
  }

  @TraceExecution('dashboard')
  reload(): void {
    this.store.dispatch(DashboardActions.loadAll());
  }
}
