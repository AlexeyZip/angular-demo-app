import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, from, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { DashboardApiService } from '../../../core/services/dashboard-api.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { DashboardActions } from './dashboard.actions';
import { selectDashboardStatus } from './dashboard.selectors';

@Injectable()
export class DashboardEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(DashboardApiService);
  private readonly store = inject(Store);
  private readonly i18n = inject(I18nService);

  readonly loadOnEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.enter),
      withLatestFrom(this.store.select(selectDashboardStatus)),
      filter(([_, status]) => status === 'idle' || status === 'error'),
      map(() => DashboardActions.loadAll()),
    ),
  );

  readonly loadAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadAll),
      mergeMap(() =>
        from([
          DashboardActions.loadSummary(),
          DashboardActions.loadInsights(),
          DashboardActions.checkHealth(),
        ]),
      ),
    ),
  );

  readonly loadSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadSummary),
      mergeMap(() =>
        this.api.getSummary().pipe(
          map((summary) => DashboardActions.loadSummarySuccess({ summary })),
          catchError(() =>
            of(
              DashboardActions.loadSummaryFailure({
                message: this.i18n.translate('dashboard.errors.summaryLoad'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly loadInsights$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadInsights),
      mergeMap(() =>
        this.api.getInsights().pipe(
          map((insights) => DashboardActions.loadInsightsSuccess({ insights })),
          catchError(() =>
            of(
              DashboardActions.loadInsightsFailure({
                message: this.i18n.translate('dashboard.errors.insightsLoad'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly checkHealth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.checkHealth),
      mergeMap(() =>
        this.api.getHealth().pipe(
          map((r) => DashboardActions.checkHealthSuccess({ ok: r.ok })),
          catchError(() => of(DashboardActions.checkHealthFailure())),
        ),
      ),
    ),
  );
}
