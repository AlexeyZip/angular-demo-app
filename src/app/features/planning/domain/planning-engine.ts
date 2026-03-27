import { LinkedList } from './linked-list';
import { PlanningItem } from './planning.model';
import { Queue } from './queue';
import { PrioritizationStrategy } from './planning.strategy';
import { NormalizedScenario } from './scenario.factory';
import { TeamTreeNode, foldTree } from './tree';

export interface PlannedStep {
  order: number;
  itemId: string;
  title: string;
  team: string;
  effort: number;
  score: number;
}

export interface PlanningResult {
  strategy: string;
  scheduled: PlannedStep[];
  blocked: PlanningItem[];
  metrics: Record<string, number>;
}

interface TeamState {
  id: string;
  name: string;
  remainingCapacity: number;
  skills: Set<string>;
}

function collectTeams(root: TeamTreeNode): TeamState[] {
  const teams: TeamState[] = [];
  foldTree(root, undefined, (_acc, node) => {
    if (node.id !== 'root') {
      teams.push({
        id: node.id,
        name: node.name,
        remainingCapacity: node.capacity,
        skills: new Set(node.skills),
      });
    }
    return undefined;
  });
  return teams;
}

function pickTeam(item: PlanningItem, teams: TeamState[]): TeamState | null {
  const required = new Set(item.skills);
  const possible = teams
    .filter((t) => t.remainingCapacity >= item.effort)
    .filter((t) => {
      for (const skill of required) {
        if (!t.skills.has(skill)) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => b.remainingCapacity - a.remainingCapacity);

  return possible[0] ?? null;
}

export class PlanningEngine {
  static buildPlan(input: NormalizedScenario, strategy: PrioritizationStrategy): PlanningResult {
    const graph = input.dependencyGraph;
    const indegree = graph.inDegreeMap();
    const queue = new Queue<string>();
    const planList = new LinkedList<PlannedStep>();
    const teams = collectTeams(input.orgTree);
    const scheduledIds = new Set<string>();

    for (const nodeId of graph.nodes()) {
      if ((indegree.get(nodeId) ?? 0) === 0) {
        queue.enqueue(nodeId);
      }
    }

    while (!queue.isEmpty()) {
      const readyChunk = queue.toArray();
      // Reset queue and refill with sorted candidates for deterministic scheduling.
      while (!queue.isEmpty()) {
        queue.dequeue();
      }

      readyChunk
        .sort((a, b) => strategy.score(input.itemsById[b]) - strategy.score(input.itemsById[a]))
        .forEach((id) => queue.enqueue(id));

      const nextId = queue.dequeue();
      if (!nextId || scheduledIds.has(nextId)) {
        continue;
      }

      const item = input.itemsById[nextId];
      const assignedTeam = pickTeam(item, teams);
      if (!assignedTeam) {
        continue;
      }

      assignedTeam.remainingCapacity -= item.effort;
      scheduledIds.add(nextId);
      planList.append({
        order: planList.size() + 1,
        itemId: item.id,
        title: item.title,
        team: assignedTeam.name,
        effort: item.effort,
        score: Math.round(strategy.score(item) * 100) / 100,
      });

      for (const neighbor of graph.neighbors(nextId)) {
        const current = (indegree.get(neighbor) ?? 0) - 1;
        indegree.set(neighbor, current);
        if (current === 0) {
          queue.enqueue(neighbor);
        }
      }
    }

    const blocked = Object.values(input.itemsById).filter((item) => !scheduledIds.has(item.id));
    const totalCapacity = teams.reduce((acc, team) => acc + team.remainingCapacity, 0);
    const usedCapacity = foldTree(input.orgTree, 0, (acc, node) => acc + node.capacity) - totalCapacity;

    return {
      strategy: strategy.type,
      scheduled: planList.toArray(),
      blocked,
      metrics: {
        scheduledCount: scheduledIds.size,
        blockedCount: blocked.length,
        totalItems: Object.keys(input.itemsById).length,
        dependencyEdges: input.dependencyGraph.edgesCount(),
        usedCapacity,
      },
    };
  }
}
