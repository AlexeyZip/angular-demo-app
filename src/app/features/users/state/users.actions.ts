import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserDto } from '../../../core/services/users-api.service';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Enter Page': emptyProps(),
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: UserDto[] }>(),
    'Load Users Failure': props<{ message: string }>(),
    'Filter Query Changed': props<{ query: string }>(),
  },
});
