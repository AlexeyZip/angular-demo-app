import { createReducer, on } from '@ngrx/store';
import { ProjectFormValue } from '../../../core/services/project-studio-api.service';
import { ProjectStudioActions } from './project-studio.actions';

export type ProjectStudioLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';
export type ProjectStudioSaveStatus = 'idle' | 'saving' | 'saved' | 'error';
export type ProjectStudioPublishStatus = 'idle' | 'publishing' | 'published' | 'error';

export interface ProjectStudioState {
  loadStatus: ProjectStudioLoadStatus;
  saveStatus: ProjectStudioSaveStatus;
  publishStatus: ProjectStudioPublishStatus;
  loadError: string | null;
  saveError: string | null;
  publishError: string | null;
  template: ProjectFormValue | null;
  draft: ProjectFormValue | null;
  lastSavedAt: string | null;
  version: number | null;
  lastPublishedId: string | null;
}

export const initialProjectStudioState: ProjectStudioState = {
  loadStatus: 'idle',
  saveStatus: 'idle',
  publishStatus: 'idle',
  loadError: null,
  saveError: null,
  publishError: null,
  template: null,
  draft: null,
  lastSavedAt: null,
  version: null,
  lastPublishedId: null,
};

export const projectStudioReducer = createReducer(
  initialProjectStudioState,
  on(ProjectStudioActions.enter, (state): ProjectStudioState => ({
    ...state,
    loadError: null,
    saveError: null,
    publishError: null,
  })),
  on(ProjectStudioActions.loadTemplate, (state): ProjectStudioState => ({
    ...state,
    loadStatus: 'loading',
    loadError: null,
  })),
  on(ProjectStudioActions.loadTemplateSuccess, (state, { template }): ProjectStudioState => ({
    ...state,
    loadStatus: 'loaded',
    template,
    draft: state.draft ?? template,
  })),
  on(ProjectStudioActions.loadTemplateFailure, (state, { message }): ProjectStudioState => ({
    ...state,
    loadStatus: 'error',
    loadError: message,
  })),
  on(ProjectStudioActions.loadDraftSuccess, (state, { draft }): ProjectStudioState => ({
    ...state,
    draft: draft ?? state.draft,
  })),
  on(ProjectStudioActions.draftChanged, (state, { draft }): ProjectStudioState => ({
    ...state,
    draft,
  })),
  on(ProjectStudioActions.saveDraft, (state): ProjectStudioState => ({
    ...state,
    saveStatus: 'saving',
    saveError: null,
  })),
  on(ProjectStudioActions.saveDraftSuccess, (state, { payload }): ProjectStudioState => ({
    ...state,
    saveStatus: 'saved',
    saveError: null,
    lastSavedAt: payload.savedAt,
    version: payload.version,
  })),
  on(ProjectStudioActions.saveDraftFailure, (state, { message }): ProjectStudioState => ({
    ...state,
    saveStatus: 'error',
    saveError: message,
  })),
  on(ProjectStudioActions.publish, (state): ProjectStudioState => ({
    ...state,
    publishStatus: 'publishing',
    publishError: null,
  })),
  on(ProjectStudioActions.publishSuccess, (state, { payload }): ProjectStudioState => ({
    ...state,
    publishStatus: 'published',
    publishError: null,
    lastPublishedId: payload.id,
  })),
  on(ProjectStudioActions.publishFailure, (state, { message }): ProjectStudioState => ({
    ...state,
    publishStatus: 'error',
    publishError: message,
  })),
);
