import { Routes } from '@angular/router';

export const REALTIME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./realtime-page.component').then((m) => m.RealtimePageComponent),
  },
];
