import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../tokens/api-base-url.token';
import { AnalyticsOverviewDto } from './interfaces/analytics.interfaces';
export * from './interfaces/analytics.interfaces';

@Injectable({ providedIn: 'root' })
export class AnalyticsApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string,
  ) {}

  getOverview(): Observable<AnalyticsOverviewDto> {
    return this.http.get<AnalyticsOverviewDto>(`${this.baseUrl}/analytics/overview`);
  }
}
