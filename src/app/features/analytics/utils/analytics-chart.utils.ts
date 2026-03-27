import { ChartConfiguration } from 'chart.js';
import {
  AnalyticsMonthlyBudgetDto,
  AnalyticsRiskDistributionDto,
} from '../../../core/services/analytics-api.service';

export function buildBudgetChartConfig(
  trend: AnalyticsMonthlyBudgetDto[],
  translate: (key: string) => string,
): ChartConfiguration<'bar'> {
  return {
    type: 'bar',
    data: {
      labels: trend.map((x) => x.month),
      datasets: [
        {
          label: translate('analytics.charts.planned'),
          data: trend.map((x) => x.planned),
          backgroundColor: '#c7d2fe',
          borderColor: '#6366f1',
        },
        {
          label: translate('analytics.charts.actual'),
          data: trend.map((x) => x.actual),
          backgroundColor: '#93c5fd',
          borderColor: '#2563eb',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };
}

export function buildRiskChartConfig(
  distribution: AnalyticsRiskDistributionDto[],
  translate: (key: string) => string,
): ChartConfiguration<'doughnut'> {
  return {
    type: 'doughnut',
    data: {
      labels: distribution.map((x) => translate(`risk.${x.level}`)),
      datasets: [
        {
          data: distribution.map((x) => x.count),
          backgroundColor: ['#22c55e', '#f59e0b', '#f97316', '#ef4444'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
      },
    },
  };
}
