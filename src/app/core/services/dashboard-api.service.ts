import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../tokens/api-base-url.token';
import { DashboardInsightsDto, DashboardSummaryDto, HealthDto } from './interfaces/dashboard.interfaces';
export * from './interfaces/dashboard.interfaces';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string,
  ) {}

  getSummary(): Observable<DashboardSummaryDto> {
    return this.http.get<DashboardSummaryDto>(`${this.baseUrl}/dashboard/summary`);
  }

  getInsights(): Observable<DashboardInsightsDto> {
    return this.http.get<DashboardInsightsDto>(`${this.baseUrl}/dashboard/insights`);
  }

  getHealth(): Observable<HealthDto> {
    return this.http.get<HealthDto>(`${this.baseUrl}/health`);
  }
}
