export interface TeamRowVm {
  id: string;
  name: string;
  depth: number;
  capacity: number;
  used: number;
  hasChildren: boolean;
  isLast: boolean;
  ancestorIds: string[];
  ancestorHasNext: boolean[];
}

export interface GraphNodeVm {
  id: string;
  title: string;
  status: 'scheduled' | 'blocked';
  team: string;
  x: number;
  y: number;
  order: number;
  level: number;
  risk: number;
  effort: number;
  value: number;
  dimmed: boolean;
  active: boolean;
  linked: boolean;
  dependsOn: string[];
}

export interface GraphEdgeVm {
  id: string;
  from: string;
  to: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  active: boolean;
  dimmed: boolean;
}

export interface GraphVm {
  nodes: GraphNodeVm[];
  edges: GraphEdgeVm[];
  width: number;
  height: number;
}

export interface TeamOptionVm {
  id: string;
  name: string;
}
