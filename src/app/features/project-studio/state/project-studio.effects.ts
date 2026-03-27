import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, debounceTime, filter, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { I18nService } from '../../../core/i18n/i18n.service';
import { ProjectStudioApiService } from '../../../core/services/project-studio-api.service';
import { ProjectStudioActions } from './project-studio.actions';
import { selectProjectLoadStatus } from './project-studio.selectors';

@Injectable()
export class ProjectStudioEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ProjectStudioApiService);
  private readonly store = inject(Store);
  private readonly i18n = inject(I18nService);

  readonly loadOnEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectStudioActions.enter),
      withLatestFrom(this.store.select(selectProjectLoadStatus)),
      filter(([_, status]) => status === 'idle' || status === 'error'),
      map(() => ProjectStudioActions.loadTemplate()),
    ),
  );

  readonly loadTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectStudioActions.loadTemplate),
      mergeMap(() =>
        this.api.getTemplate().pipe(
          map((template) => ProjectStudioActions.loadTemplateSuccess({ template })),
          catchError(() =>
            of(
              ProjectStudioActions.loadTemplateFailure({
                message: this.i18n.translate('projectStudio.errors.loadTemplate'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly autoSave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectStudioActions.draftChanged),
      filter(({ isValid }) => isValid),
      debounceTime(900),
      map(({ draft }) => ProjectStudioActions.saveDraft({ draft })),
    ),
  );

  readonly manualSave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectStudioActions.manualSaveRequested),
      map(({ draft }) => ProjectStudioActions.saveDraft({ draft })),
    ),
  );

  readonly publishRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectStudioActions.publishRequested),
      map(({ draft }) => ProjectStudioActions.publish({ draft })),
    ),
  );

  readonly saveDraft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectStudioActions.saveDraft),
      mergeMap(({ draft }) =>
        this.api.saveDraft(draft).pipe(
          map((payload) => ProjectStudioActions.saveDraftSuccess({ payload })),
          catchError(() =>
            of(
              ProjectStudioActions.saveDraftFailure({
                message: this.i18n.translate('projectStudio.errors.saveDraft'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly publish$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectStudioActions.publish),
      mergeMap(({ draft }) =>
        this.api.publish(draft).pipe(
          map((payload) => ProjectStudioActions.publishSuccess({ payload })),
          catchError(() =>
            of(
              ProjectStudioActions.publishFailure({
                message: this.i18n.translate('projectStudio.errors.publish'),
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
