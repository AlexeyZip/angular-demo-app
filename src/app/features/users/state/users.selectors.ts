import { createFeatureSelector, createSelector } from '@ngrx/store';
import { filterBySearchQuery } from '../../../core/utils/search-text';
import { usersAdapter, UsersState } from './users.reducer';

export const selectUsersState = createFeatureSelector<UsersState>('users');

const { selectAll } = usersAdapter.getSelectors(selectUsersState);

export const selectAllUsers = selectAll;

export const selectUsersLoadStatus = createSelector(selectUsersState, (s) => s.loadStatus);

export const selectUsersLoadError = createSelector(selectUsersState, (s) => s.loadError);

export const selectUsersFilterQuery = createSelector(selectUsersState, (s) => s.filterQuery);

export const selectFilteredUsers = createSelector(
  selectAllUsers,
  selectUsersFilterQuery,
  (users, query) => filterBySearchQuery(users, query, (user) => [user.name, user.email, user.role]),
);
