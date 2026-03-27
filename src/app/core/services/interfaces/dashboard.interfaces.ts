export interface DashboardSummaryDto {
  activeUsers: number;
  openTickets: number;
  revenueUsd: number;
  generatedAt: string;
}

export interface DashboardRiskProjectDto {
  id: string;
  name: string;
  code: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  budget: number;
  updatedAt: string;
}

export interface DashboardMilestoneDto {
  projectId: string;
  projectName: string;
  title: string;
  dueDate: string;
  done: boolean;
}

export interface DashboardWorkloadDto {
  id: string;
  name: string;
  role: string;
  openTasks: number;
  utilization: number;
}

export interface DashboardInsightsDto {
  highRiskProjects: DashboardRiskProjectDto[];
  upcomingMilestones: DashboardMilestoneDto[];
  teamWorkload: DashboardWorkloadDto[];
}

export interface HealthDto {
  ok: boolean;
}
