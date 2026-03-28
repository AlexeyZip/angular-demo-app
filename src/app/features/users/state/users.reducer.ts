import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { UserDto } from '../../../core/services/users-api.service';
import { UsersActions } from './users.actions';

export type UsersLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

export const usersAdapter: EntityAdapter<UserDto> = createEntityAdapter<UserDto>({
  selectId: (u) => u.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name, 'en'),
});

export interface UsersState extends EntityState<UserDto> {
  loadStatus: UsersLoadStatus;
  loadError: string | null;
  filterQuery: string;
}

export const initialUsersState: UsersState = usersAdapter.getInitialState({
  loadStatus: 'idle',
  loadError: null,
  filterQuery: '',
});

export const usersReducer = createReducer(
  initialUsersState,
  on(UsersActions.enterPage, (state) => ({
    ...state,
    loadError: null,
  })),
  on(UsersActions.loadUsers, (state): UsersState => ({
    ...state,
    loadStatus: 'loading',
    loadError: null,
  })),
  on(UsersActions.loadUsersSuccess, (state, { users }): UsersState =>
    usersAdapter.setAll(users, {
      ...state,
      loadStatus: 'loaded',
      loadError: null,
    }),
  ),
  on(UsersActions.loadUsersFailure, (state, { message }): UsersState => ({
    ...state,
    loadStatus: 'error',
    loadError: message,
  })),
  on(UsersActions.filterQueryChanged, (state, { query }) => ({
    ...state,
    filterQuery: query,
  })),
);
