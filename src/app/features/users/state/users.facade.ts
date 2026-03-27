import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, map, of, switchMap, take } from 'rxjs';
import { TraceExecution } from '../../../core/meta/trace.decorator';
import { UserDto } from '../../../core/services/users-api.service';
import { UsersActions } from './users.actions';
import { UsersLoadStatus } from './users.reducer';
import {
  selectFilteredUsers,
  selectUsersLoadError,
  selectUsersLoadStatus,
} from './users.selectors';

@Injectable({ providedIn: 'root' })
export class UsersFacade {
  private readonly store = inject(Store);

  readonly users$: Observable<UserDto[]> = this.store.select(selectFilteredUsers);
  readonly loadStatus$: Observable<UsersLoadStatus> = this.store.select(selectUsersLoadStatus);
  readonly loadError$: Observable<string | null> = this.store.select(selectUsersLoadError);

  enterPage(): void {
    this.store.dispatch(UsersActions.enterPage());
  }

  setFilter(query: string): void {
    this.store.dispatch(UsersActions.filterQueryChanged({ query }));
  }

  @TraceExecution('users')
  reload(): void {
    this.store.dispatch(UsersActions.loadUsers());
  }

  /**
   * ResolveFn: дождаться терминального состояния загрузки перед открытием страницы.
   */
  ensureLoaded(): Observable<void> {
    this.store.dispatch(UsersActions.enterPage());
    return this.store.select(selectUsersLoadStatus).pipe(
      take(1),
      switchMap((status) => {
        if (status === 'loaded') {
          return of(undefined);
        }
        if (status === 'loading') {
          return this.store.select(selectUsersLoadStatus).pipe(
            filter((s) => s === 'loaded' || s === 'error'),
            take(1),
            map(() => undefined),
          );
        }
        return this.store.select(selectUsersLoadStatus).pipe(
          filter((s) => s === 'loaded' || s === 'error'),
          take(1),
          map(() => undefined),
        );
      }),
    );
  }
}
