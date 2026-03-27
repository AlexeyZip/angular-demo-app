export interface TeamTreeNode {
  id: string;
  name: string;
  capacity: number;
  skills: string[];
  children: TeamTreeNode[];
}

export function buildTeamTree(teams: TeamTreeNode[]): TeamTreeNode {
  return {
    id: 'root',
    name: 'Org',
    capacity: 0,
    skills: [],
    children: teams,
  };
}

export function foldTree<T>(
  node: TeamTreeNode,
  seed: T,
  reducer: (acc: T, current: TeamTreeNode) => T,
): T {
  let acc = reducer(seed, node);
  for (const child of node.children) {
    acc = foldTree(child, acc, reducer);
  }
  return acc;
}
