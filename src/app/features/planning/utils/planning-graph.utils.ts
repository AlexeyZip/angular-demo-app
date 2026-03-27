import { PlannedStep, PlanningResult } from '../domain/planning-engine';
import { PlanningItem } from '../domain/planning.model';
import { NormalizedScenario } from '../domain/scenario.factory';
import { GraphEdgeVm, GraphNodeVm } from '../interfaces/planning-vm.interfaces';

const LEVEL_GAP = 240;
const ROW_GAP = 84;
const COLUMN_TOP = 48;
const COLUMN_X_START = 90;

export function buildOrderById(steps: PlannedStep[]): Map<string, number> {
  const orderById = new Map<string, number>();
  steps.forEach((step, idx) => orderById.set(step.itemId, idx + 1));
  return orderById;
}

export function buildLevelMap(
  allItems: PlanningItem[],
  scenario: NormalizedScenario,
): Map<string, number> {
  const levelById = new Map<string, number>();
  const calcLevel = (item: PlanningItem): number => {
    if (levelById.has(item.id)) {
      return levelById.get(item.id)!;
    }
    const deps = item.dependsOn.map((depId) => scenario.itemsById[depId]).filter(Boolean);
    const level = deps.length ? Math.max(...deps.map(calcLevel)) + 1 : 0;
    levelById.set(item.id, level);
    return level;
  };
  allItems.forEach((item) => calcLevel(item));
  return levelById;
}

export function groupItemsByLevel(
  allItems: PlanningItem[],
  levelById: Map<string, number>,
  orderById: Map<string, number>,
): Map<number, PlanningItem[]> {
  const itemsByLevel = new Map<number, PlanningItem[]>();
  for (const item of allItems) {
    const level = levelById.get(item.id) ?? 0;
    if (!itemsByLevel.has(level)) {
      itemsByLevel.set(level, []);
    }
    itemsByLevel.get(level)!.push(item);
  }
  itemsByLevel.forEach((items) => {
    items.sort((a, b) => {
      const oa = orderById.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const ob = orderById.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      return oa - ob || a.title.localeCompare(b.title);
    });
  });
  return itemsByLevel;
}

export function collectFocusLinks(allItems: PlanningItem[], focusId: string | null): Set<string> {
  const linksByNode = new Map<string, Set<string>>();
  for (const item of allItems) {
    if (!linksByNode.has(item.id)) {
      linksByNode.set(item.id, new Set<string>());
    }
    for (const dep of item.dependsOn) {
      if (!linksByNode.has(dep)) {
        linksByNode.set(dep, new Set<string>());
      }
      linksByNode.get(item.id)!.add(dep);
      linksByNode.get(dep)!.add(item.id);
    }
  }
  return new Set<string>(focusId ? linksByNode.get(focusId) ?? [] : []);
}

export function buildNodePositions(itemsByLevel: Map<number, PlanningItem[]>): Map<string, { x: number; y: number }> {
  const nodePosition = new Map<string, { x: number; y: number }>();
  const levelKeys = Array.from(itemsByLevel.keys()).sort((a, b) => a - b);

  for (const level of levelKeys) {
    const levelItems = itemsByLevel.get(level) ?? [];
    const x = COLUMN_X_START + level * LEVEL_GAP;
    levelItems.forEach((item, index) => {
      const y = COLUMN_TOP + index * ROW_GAP;
      nodePosition.set(item.id, { x, y });
    });
  }
  return nodePosition;
}

export function buildGraphNodes(
  allItems: PlanningItem[],
  result: PlanningResult,
  orderById: Map<string, number>,
  levelById: Map<string, number>,
  focusId: string | null,
  focusLinks: Set<string>,
  nodePosition: Map<string, { x: number; y: number }>,
): GraphNodeVm[] {
  const nodes: GraphNodeVm[] = [];

  for (const item of allItems) {
    const pos = nodePosition.get(item.id);
    if (!pos) {
      continue;
    }
    const scheduled = result.scheduled.find((step) => step.itemId === item.id);
    const status = scheduled ? 'scheduled' : 'blocked';
    const order = orderById.get(item.id) ?? result.scheduled.length + 1;
    const isFocused = focusId === item.id;
    const isLinked = focusLinks.has(item.id);
    const dimmed = !!focusId && !isFocused && !isLinked;

    nodes.push({
      id: item.id,
      title: item.title,
      status,
      team: scheduled?.team ?? 'Blocked',
      x: pos.x,
      y: pos.y,
      order,
      level: levelById.get(item.id) ?? 0,
      risk: item.risk,
      effort: item.effort,
      value: item.value,
      dimmed,
      active: isFocused,
      linked: isLinked,
      dependsOn: item.dependsOn,
    });
  }

  return nodes;
}

export function buildGraphEdges(
  allItems: PlanningItem[],
  focusId: string | null,
  nodePosition: Map<string, { x: number; y: number }>,
): GraphEdgeVm[] {
  const edges: GraphEdgeVm[] = [];

  for (const item of allItems) {
    for (const dep of item.dependsOn) {
      const from = nodePosition.get(dep);
      const to = nodePosition.get(item.id);
      if (!from || !to) {
        continue;
      }
      const active = !!focusId && (focusId === dep || focusId === item.id);
      edges.push({
        id: `${dep}->${item.id}`,
        from: dep,
        to: item.id,
        fromX: from.x + 148,
        fromY: from.y + 24,
        toX: to.x - 4,
        toY: to.y + 24,
        active,
        dimmed: !!focusId && !active,
      });
    }
  }

  return edges;
}

export function calculateGraphDimensions(itemsByLevel: Map<number, PlanningItem[]>): {
  width: number;
  height: number;
} {
  const levelKeys = Array.from(itemsByLevel.keys());
  const maxLevel = levelKeys.length ? Math.max(...levelKeys) : 0;
  const maxRows = Math.max(...Array.from(itemsByLevel.values()).map((arr) => arr.length), 1);
  return {
    width: Math.max(1000, 260 + (maxLevel + 1) * LEVEL_GAP),
    height: Math.max(360, 120 + maxRows * ROW_GAP),
  };
}
