export interface ProjectStakeholderDto {
  name: string;
  role: string;
  email: string;
}

export interface ProjectMilestoneDto {
  title: string;
  dueDate: string;
  done: boolean;
}

export interface ProjectFormValue {
  name: string;
  code: string;
  description: string;
  budget: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requiresComplianceReview: boolean;
  schedule: {
    startDate: string;
    endDate: string;
  };
  stakeholders: ProjectStakeholderDto[];
  milestones: ProjectMilestoneDto[];
  channels: {
    email: boolean;
    sms: boolean;
    slack: boolean;
  };
}

export interface ValidateCodeResponse {
  isUnique: boolean;
}

export interface SaveDraftResponse {
  id: string;
  version: number;
  savedAt: string;
}

export interface PublishProjectResponse {
  id: string;
  code: string;
  savedAt: string;
}

export interface ProjectEntitySummary {
  id: string;
  name: string;
  code: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  budget: number;
  updatedAt: string;
  status: 'published';
}

export interface ProjectEntityDetails extends ProjectFormValue {
  id: string;
  status: 'published';
  createdAt: string;
  updatedAt: string;
}
