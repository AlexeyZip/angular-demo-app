import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, map, of, switchMap, take } from 'rxjs';
import { TraceExecution } from '../../../core/meta/trace.decorator';
import { ProjectFormValue } from '../../../core/services/project-studio-api.service';
import { ProjectStudioActions } from './project-studio.actions';
import {
  selectProjectDraft,
  selectProjectLastSavedAt,
  selectProjectLastPublishedId,
  selectProjectLoadError,
  selectProjectLoadStatus,
  selectProjectPublishError,
  selectProjectPublishStatus,
  selectProjectSaveError,
  selectProjectSaveStatus,
  selectProjectVersion,
} from './project-studio.selectors';

@Injectable({ providedIn: 'root' })
export class ProjectStudioFacade {
  private readonly store = inject(Store);

  readonly draft$: Observable<ProjectFormValue | null> = this.store.select(selectProjectDraft);
  readonly loadStatus$ = this.store.select(selectProjectLoadStatus);
  readonly saveStatus$ = this.store.select(selectProjectSaveStatus);
  readonly publishStatus$ = this.store.select(selectProjectPublishStatus);
  readonly loadError$ = this.store.select(selectProjectLoadError);
  readonly saveError$ = this.store.select(selectProjectSaveError);
  readonly publishError$ = this.store.select(selectProjectPublishError);
  readonly lastSavedAt$ = this.store.select(selectProjectLastSavedAt);
  readonly version$ = this.store.select(selectProjectVersion);
  readonly lastPublishedId$ = this.store.select(selectProjectLastPublishedId);

  enter(): void {
    this.store.dispatch(ProjectStudioActions.enter());
  }

  draftChanged(draft: ProjectFormValue, isValid: boolean): void {
    this.store.dispatch(ProjectStudioActions.draftChanged({ draft, isValid }));
  }

  @TraceExecution('projectStudio')
  saveNow(draft: ProjectFormValue): void {
    this.store.dispatch(ProjectStudioActions.manualSaveRequested({ draft }));
  }

  @TraceExecution('projectStudio')
  publish(draft: ProjectFormValue): void {
    this.store.dispatch(ProjectStudioActions.publishRequested({ draft }));
  }

  ensureTemplateLoaded(): Observable<void> {
    this.store.dispatch(ProjectStudioActions.enter());
    return this.store.select(selectProjectLoadStatus).pipe(
      take(1),
      switchMap((status) => {
        if (status === 'loaded') {
          return of(undefined);
        }
        return this.store.select(selectProjectLoadStatus).pipe(
          filter((s) => s === 'loaded' || s === 'error'),
          take(1),
          map(() => undefined),
        );
      }),
    );
  }
}
