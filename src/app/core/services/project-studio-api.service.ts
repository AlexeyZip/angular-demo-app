import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../tokens/api-base-url.token';
import {
  ProjectEntityDetails,
  ProjectEntitySummary,
  ProjectFormValue,
  PublishProjectResponse,
  SaveDraftResponse,
  ValidateCodeResponse,
} from './interfaces/project-studio.interfaces';
export * from './interfaces/project-studio.interfaces';

@Injectable({ providedIn: 'root' })
export class ProjectStudioApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string,
  ) {}

  getTemplate(): Observable<ProjectFormValue> {
    return this.http.get<ProjectFormValue>(`${this.baseUrl}/projects/template`);
  }

  validateCode(code: string): Observable<ValidateCodeResponse> {
    return this.http.post<ValidateCodeResponse>(`${this.baseUrl}/projects/validate-code`, { code });
  }

  saveDraft(payload: ProjectFormValue): Observable<SaveDraftResponse> {
    return this.http.post<SaveDraftResponse>(`${this.baseUrl}/projects/save-draft`, payload);
  }

  publish(payload: ProjectFormValue): Observable<PublishProjectResponse> {
    return this.http.post<PublishProjectResponse>(`${this.baseUrl}/projects/publish`, payload);
  }

  getProjects(): Observable<ProjectEntitySummary[]> {
    return this.http.get<ProjectEntitySummary[]>(`${this.baseUrl}/projects`);
  }

  getProjectById(id: string): Observable<ProjectEntityDetails> {
    return this.http.get<ProjectEntityDetails>(`${this.baseUrl}/projects/${id}`);
  }
}
