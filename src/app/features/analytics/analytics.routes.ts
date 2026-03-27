import { Routes } from '@angular/router';
import { analyticsResolver } from './analytics.resolver';

export const ANALYTICS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./analytics-page.component').then((m) => m.AnalyticsPageComponent),
    resolve: { overview: analyticsResolver },
  },
];
