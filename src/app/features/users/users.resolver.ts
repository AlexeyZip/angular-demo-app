import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UsersFacade } from './state/users.facade';

export const usersPageResolver: ResolveFn<void> = () => inject(UsersFacade).ensureLoaded();
