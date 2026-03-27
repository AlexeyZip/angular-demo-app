import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AnalyticsApiService, AnalyticsOverviewDto } from '../../core/services/analytics-api.service';

export const analyticsResolver: ResolveFn<AnalyticsOverviewDto> = () =>
  inject(AnalyticsApiService).getOverview();
