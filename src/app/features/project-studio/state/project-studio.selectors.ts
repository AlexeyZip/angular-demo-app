import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectStudioState } from './project-studio.reducer';

export const selectProjectStudioState = createFeatureSelector<ProjectStudioState>('projectStudio');

export const selectProjectTemplate = createSelector(selectProjectStudioState, (s) => s.template);
export const selectProjectDraft = createSelector(selectProjectStudioState, (s) => s.draft);
export const selectProjectLoadStatus = createSelector(selectProjectStudioState, (s) => s.loadStatus);
export const selectProjectSaveStatus = createSelector(selectProjectStudioState, (s) => s.saveStatus);
export const selectProjectPublishStatus = createSelector(selectProjectStudioState, (s) => s.publishStatus);
export const selectProjectLoadError = createSelector(selectProjectStudioState, (s) => s.loadError);
export const selectProjectSaveError = createSelector(selectProjectStudioState, (s) => s.saveError);
export const selectProjectPublishError = createSelector(selectProjectStudioState, (s) => s.publishError);
export const selectProjectLastSavedAt = createSelector(selectProjectStudioState, (s) => s.lastSavedAt);
export const selectProjectVersion = createSelector(selectProjectStudioState, (s) => s.version);
export const selectProjectLastPublishedId = createSelector(selectProjectStudioState, (s) => s.lastPublishedId);

export const selectProjectStudioVm = createSelector(selectProjectStudioState, (s) => ({
  loadStatus: s.loadStatus,
  saveStatus: s.saveStatus,
  publishStatus: s.publishStatus,
  loadError: s.loadError,
  saveError: s.saveError,
  publishError: s.publishError,
  template: s.template,
  draft: s.draft,
  lastSavedAt: s.lastSavedAt,
  version: s.version,
  lastPublishedId: s.lastPublishedId,
}));
