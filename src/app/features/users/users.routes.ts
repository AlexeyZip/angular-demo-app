import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./users-page.component').then((m) => m.UsersPageComponent),
  },
];
