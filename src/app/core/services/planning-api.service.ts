import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PlanningTeamDto {
  id: string;
  name: string;
  capacity: number;
  skills: string[];
  children?: PlanningTeamDto[];
}

export interface PlanningItemDto {
  id: string;
  title: string;
  effort: number;
  value: number;
  risk: number;
  skills: string[];
  dependsOn: string[];
}

export interface PlanningScenarioDto {
  teams: PlanningTeamDto[];
  items: PlanningItemDto[];
}

@Injectable({ providedIn: 'root' })
export class PlanningApiService {
  constructor(private readonly http: HttpClient) {}

  getScenario(): Observable<PlanningScenarioDto> {
    return this.http.get<PlanningScenarioDto>('/api/planning/scenario');
  }
}
