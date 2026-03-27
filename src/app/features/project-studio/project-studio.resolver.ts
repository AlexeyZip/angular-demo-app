import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProjectStudioFacade } from './state/project-studio.facade';

export const projectStudioResolver: ResolveFn<void> = () =>
  inject(ProjectStudioFacade).ensureTemplateLoaded();
