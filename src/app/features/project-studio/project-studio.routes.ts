import { Routes } from '@angular/router';

export const PROJECT_STUDIO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./project-studio-page.component').then((m) => m.ProjectStudioPageComponent),
  },
];
