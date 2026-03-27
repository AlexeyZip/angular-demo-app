import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import {
  ProjectEntitySummary,
  ProjectStudioApiService,
} from '../../../core/services/project-studio-api.service';

export const projectsListResolver: ResolveFn<ProjectEntitySummary[]> = () =>
  inject(ProjectStudioApiService).getProjects();
