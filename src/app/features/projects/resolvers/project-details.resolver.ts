import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import {
  ProjectEntityDetails,
  ProjectStudioApiService,
} from '../../../core/services/project-studio-api.service';

export const projectDetailsResolver: ResolveFn<ProjectEntityDetails> = (route) =>
  inject(ProjectStudioApiService).getProjectById(route.paramMap.get('id') ?? '');
