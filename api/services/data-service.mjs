/** Model + in-memory store (MVC: data is separated from controllers). */

const users = [
  { id: '1', name: 'Anna Walker', role: 'Admin', email: 'anna@example.com' },
  { id: '2', name: 'Igor Smith', role: 'Support', email: 'igor@example.com' },
  { id: '3', name: 'Мария Ким', role: 'Analyst', email: 'maria@example.com' },
  { id: '4', name: 'Leo Park', role: 'Developer', email: 'leo@example.com' },
];

const usedProjectCodes = new Set(['ERP-ALPHA', 'CORE-OPS', 'FIN-2026']);

const defaultProjectTemplate = {
  name: 'Internal Procurement Platform',
  code: 'PRC-2026',
  description: 'Platform for internal request and procurement workflows.',
  budget: 250000,
  riskLevel: 'medium',
  requiresComplianceReview: true,
  schedule: {
    startDate: '2026-04-01',
    endDate: '2026-09-30',
  },
  stakeholders: [
    { name: 'Anna Walker', role: 'Product Owner', email: 'anna@example.com' },
    { name: 'Igor Smith', role: 'Tech Lead', email: 'igor@example.com' },
  ],
  milestones: [
    { title: 'Discovery', dueDate: '2026-04-20', done: true },
    { title: 'MVP Release', dueDate: '2026-06-30', done: false },
    { title: 'Production Rollout', dueDate: '2026-09-20', done: false },
  ],
  channels: {
    email: true,
    sms: false,
    slack: true,
  },
};

let latestDraft = null;
const publishedProjects = [
  {
    id: 'erp-alpha',
    ...structuredClone(defaultProjectTemplate),
    code: 'ERP-ALPHA',
    status: 'published',
    createdAt: '2026-02-10T11:20:00.000Z',
    updatedAt: '2026-02-15T10:12:00.000Z',
  },
];

export function listUsers() {
  return users;
}

export function getDashboardSummary() {
  return {
    activeUsers: users.length + 12,
    openTickets: 7,
    revenueUsd: 128_400,
    generatedAt: new Date().toISOString(),
  };
}

export function getDashboardInsights() {
  const highRiskProjects = publishedProjects
    .filter((p) => p.riskLevel === 'high' || p.riskLevel === 'critical')
    .map((p) => ({
      id: p.id,
      name: p.name,
      code: p.code,
      riskLevel: p.riskLevel,
      budget: Number(p.budget) || 0,
      updatedAt: p.updatedAt,
    }));

  const upcomingMilestones = publishedProjects
    .flatMap((project) =>
      (project.milestones ?? []).map((m) => ({
        projectId: project.id,
        projectName: project.name,
        title: m.title,
        dueDate: m.dueDate,
        done: Boolean(m.done),
      })),
    )
    .sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate))
    .slice(0, 8);

  const teamWorkload = users.map((u, index) => ({
    id: u.id,
    name: u.name,
    role: u.role,
    openTasks: 3 + index * 2,
    utilization: 62 + index * 9,
  }));

  return {
    highRiskProjects,
    upcomingMilestones,
    teamWorkload,
  };
}

export function getProjectTemplate() {
  return structuredClone(defaultProjectTemplate);
}

export function isProjectCodeUnique(code) {
  const normalized = String(code ?? '').trim().toUpperCase();
  if (!normalized) {
    return false;
  }
  return !usedProjectCodes.has(normalized);
}

export function saveProjectDraft(draft) {
  latestDraft = {
    ...draft,
    code: String(draft.code ?? '').trim().toUpperCase(),
    savedAt: new Date().toISOString(),
    version: (latestDraft?.version ?? 0) + 1,
  };
  return latestDraft;
}

export function getLatestDraft() {
  return latestDraft;
}

export function listPublishedProjects() {
  return publishedProjects.map((p) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    riskLevel: p.riskLevel,
    budget: p.budget,
    updatedAt: p.updatedAt,
    status: p.status,
  }));
}

export function getPublishedProjectById(id) {
  return publishedProjects.find((p) => p.id === id) ?? null;
}

export function publishProject(payload) {
  const now = new Date().toISOString();
  const code = String(payload.code ?? '').trim().toUpperCase();
  const existing = publishedProjects.find((p) => p.code === code);

  if (existing) {
    const updated = {
      ...existing,
      ...payload,
      code,
      status: 'published',
      updatedAt: now,
    };
    const index = publishedProjects.findIndex((p) => p.id === existing.id);
    publishedProjects[index] = updated;
    usedProjectCodes.add(code);
    return updated;
  }

  const id = `${code.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
  const created = {
    id,
    ...payload,
    code,
    status: 'published',
    createdAt: now,
    updatedAt: now,
  };

  publishedProjects.unshift(created);
  usedProjectCodes.add(code);
  return created;
}

export function getAnalyticsOverview() {
  const totalProjects = publishedProjects.length;
  const totalBudget = publishedProjects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0);
  const avgBudget = totalProjects ? Math.round(totalBudget / totalProjects) : 0;
  const highRiskCount = publishedProjects.filter(
    (p) => p.riskLevel === 'high' || p.riskLevel === 'critical',
  ).length;

  const projectRows = publishedProjects.map((p, idx) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    owner: p.stakeholders?.[0]?.name ?? 'N/A',
    budget: Number(p.budget) || 0,
    riskLevel: p.riskLevel,
    status: p.status,
    progress: Math.min(92, 40 + idx * 12),
    velocity: Math.max(65, 95 - idx * 4),
    updatedAt: p.updatedAt,
  }));

  const riskLevels = ['low', 'medium', 'high', 'critical'];
  const riskDistribution = riskLevels.map((level) => ({
    level,
    count: publishedProjects.filter((p) => p.riskLevel === level).length,
  }));

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const monthlyBudgetTrend = months.map((month, i) => ({
    month,
    planned: 140000 + i * 22000,
    actual: 130000 + i * 20000 + (i % 2 === 0 ? 7000 : -3000),
  }));

  return {
    kpi: {
      totalProjects,
      totalBudget,
      avgBudget,
      highRiskCount,
    },
    projectRows,
    riskDistribution,
    monthlyBudgetTrend,
  };
}

export function getPlanningScenario() {
  return {
    teams: [
      {
        id: 'team-platform',
        name: 'Platform Team',
        capacity: 14,
        skills: ['backend', 'api'],
        children: [
          {
            id: 'team-platform-sec',
            name: 'Platform Security',
            capacity: 10,
            skills: ['security', 'backend'],
            children: [
              {
                id: 'team-identity',
                name: 'Identity Squad',
                capacity: 8,
                skills: ['iam', 'oauth'],
                children: [
                  {
                    id: 'team-authz',
                    name: 'Authorization Pod',
                    capacity: 6,
                    skills: ['oauth'],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'team-web',
        name: 'Web Team',
        capacity: 12,
        skills: ['frontend'],
        children: [
          {
            id: 'team-experience',
            name: 'Experience Squad',
            capacity: 10,
            skills: ['ux', 'frontend'],
            children: [
              {
                id: 'team-mobile',
                name: 'Mobile Pod',
                capacity: 8,
                skills: ['mobile', 'frontend'],
              },
            ],
          },
        ],
      },
      {
        id: 'team-data',
        name: 'Data Team',
        capacity: 10,
        skills: ['data'],
        children: [
          {
            id: 'team-analytics',
            name: 'Analytics Squad',
            capacity: 8,
            skills: ['analytics', 'data'],
            children: [
              {
                id: 'team-ml',
                name: 'ML Pod',
                capacity: 8,
                skills: ['ml', 'analytics'],
                children: [
                  {
                    id: 'team-mlops',
                    name: 'MLOps Cell',
                    capacity: 6,
                    skills: ['mlops', 'ml'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    items: [
      {
        id: 'arch-foundation',
        title: 'Architecture foundation',
        effort: 8,
        value: 5,
        risk: 2,
        skills: ['backend', 'api'],
        dependsOn: [],
      },
      {
        id: 'security-gateway',
        title: 'Security gateway',
        effort: 10,
        value: 7,
        risk: 5,
        skills: ['security', 'backend'],
        dependsOn: ['arch-foundation'],
      },
      {
        id: 'identity-federation',
        title: 'Identity federation',
        effort: 7,
        value: 8,
        risk: 5,
        skills: ['iam', 'oauth'],
        dependsOn: ['security-gateway'],
      },
      {
        id: 'user-portal',
        title: 'User portal',
        effort: 12,
        value: 9,
        risk: 3,
        skills: ['frontend', 'ux'],
        dependsOn: ['arch-foundation'],
      },
      {
        id: 'mobile-workspace',
        title: 'Mobile workspace',
        effort: 7,
        value: 7,
        risk: 3,
        skills: ['frontend', 'mobile'],
        dependsOn: ['user-portal'],
      },
      {
        id: 'portfolio-analytics',
        title: 'Portfolio analytics',
        effort: 14,
        value: 8,
        risk: 4,
        skills: ['data', 'analytics'],
        dependsOn: ['arch-foundation'],
      },
      {
        id: 'risk-model',
        title: 'Risk model',
        effort: 8,
        value: 8,
        risk: 4,
        skills: ['ml', 'analytics'],
        dependsOn: ['portfolio-analytics'],
      },
      {
        id: 'model-ops',
        title: 'Model ops pipeline',
        effort: 7,
        value: 7,
        risk: 4,
        skills: ['mlops', 'ml'],
        dependsOn: ['risk-model'],
      },
      {
        id: 'audit-trail',
        title: 'Audit trail',
        effort: 6,
        value: 6,
        risk: 4,
        skills: ['backend', 'security'],
        dependsOn: ['security-gateway'],
      },
      {
        id: 'cross-team-dashboard',
        title: 'Cross-team dashboard',
        effort: 9,
        value: 8,
        risk: 2,
        skills: ['frontend', 'analytics'],
        dependsOn: ['user-portal', 'portfolio-analytics'],
      },
    ],
  };
}
