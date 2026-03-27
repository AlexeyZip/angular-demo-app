import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { I18nService } from '../../../core/i18n/i18n.service';
import { UsersApiService } from '../../../core/services/users-api.service';
import { UsersActions } from './users.actions';
import { selectUsersLoadStatus } from './users.selectors';

@Injectable()
export class UsersEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(UsersApiService);
  private readonly store = inject(Store);
  private readonly i18n = inject(I18nService);

  readonly loadOnEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.enterPage),
      withLatestFrom(this.store.select(selectUsersLoadStatus)),
      filter(([_, status]) => status === 'idle' || status === 'error'),
      map(() => UsersActions.loadUsers()),
    ),
  );

  readonly loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      mergeMap(() =>
        this.api.getAll().pipe(
          map((users) => UsersActions.loadUsersSuccess({ users })),
          catchError(() =>
            of(UsersActions.loadUsersFailure({ message: this.i18n.translate('users.errors.load') })),
          ),
        ),
      ),
    ),
  );
}
