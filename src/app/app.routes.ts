import { Routes } from '@angular/router';
import { sessionAuthCanActivate } from './auth/auth.guard';
import { projectStudioResolver } from './features/project-studio/project-studio.resolver';
import { usersPageResolver } from './features/users/users.resolver';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login-page.component').then((m) => m.LoginPageComponent),
  },
  {
    path: '',
    loadComponent: () => import('./shell/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        data: { preload: true },
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'users',
        canActivate: [sessionAuthCanActivate],
        resolve: { usersReady: usersPageResolver },
        loadChildren: () => import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
      },
      {
        path: 'project-studio',
        data: { preload: true },
        canActivate: [sessionAuthCanActivate],
        resolve: { templateReady: projectStudioResolver },
        loadChildren: () =>
          import('./features/project-studio/project-studio.routes').then((m) => m.PROJECT_STUDIO_ROUTES),
      },
      {
        path: 'projects',
        canActivate: [sessionAuthCanActivate],
        data: { preload: true },
        loadChildren: () =>
          import('./features/projects/routes/projects.routes').then((m) => m.PROJECTS_ROUTES),
      },
      {
        path: 'analytics',
        canActivate: [sessionAuthCanActivate],
        data: { preload: true },
        loadChildren: () =>
          import('./features/analytics/analytics.routes').then((m) => m.ANALYTICS_ROUTES),
      },
      {
        path: 'realtime',
        canActivate: [sessionAuthCanActivate],
        data: { preload: true },
        loadChildren: () => import('./features/realtime/realtime.routes').then((m) => m.REALTIME_ROUTES),
      },
      {
        path: 'planning',
        canActivate: [sessionAuthCanActivate],
        data: { preload: true },
        loadChildren: () => import('./features/planning/planning.routes').then((m) => m.PLANNING_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
