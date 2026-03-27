export interface PlanningItem {
  id: string;
  title: string;
  effort: number;
  value: number;
  risk: number;
  skills: string[];
  dependsOn: string[];
}

export interface PlanningTeam {
  id: string;
  name: string;
  capacity: number;
  skills: string[];
  children: PlanningTeam[];
}
