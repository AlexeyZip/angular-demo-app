import { Routes } from '@angular/router';
import { projectDetailsResolver } from '../resolvers/project-details.resolver';
import { projectsListResolver } from '../resolvers/projects-list.resolver';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/projects-list/projects-page.component').then((m) => m.ProjectsPageComponent),
    resolve: { projects: projectsListResolver },
  },
  {
    path: ':id',
    loadComponent: () =>
      import('../pages/project-details/project-details-page.component').then(
        (m) => m.ProjectDetailsPageComponent,
      ),
    resolve: { project: projectDetailsResolver },
  },
];
