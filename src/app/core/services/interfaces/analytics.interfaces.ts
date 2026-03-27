export interface AnalyticsKpiDto {
  totalProjects: number;
  totalBudget: number;
  avgBudget: number;
  highRiskCount: number;
}

export interface AnalyticsProjectRowDto {
  id: string;
  name: string;
  code: string;
  owner: string;
  budget: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  progress: number;
  velocity: number;
  updatedAt: string;
}

export interface AnalyticsRiskDistributionDto {
  level: 'low' | 'medium' | 'high' | 'critical';
  count: number;
}

export interface AnalyticsMonthlyBudgetDto {
  month: string;
  planned: number;
  actual: number;
}

export interface AnalyticsOverviewDto {
  kpi: AnalyticsKpiDto;
  projectRows: AnalyticsProjectRowDto[];
  riskDistribution: AnalyticsRiskDistributionDto[];
  monthlyBudgetTrend: AnalyticsMonthlyBudgetDto[];
}
