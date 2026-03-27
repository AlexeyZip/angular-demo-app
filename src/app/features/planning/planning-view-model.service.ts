import { Injectable } from '@angular/core';
import { PlanningResult, PlannedStep } from './domain/planning-engine';
import { PlanningItem } from './domain/planning.model';
import { NormalizedScenario } from './domain/scenario.factory';
import { TeamTreeNode } from './domain/tree';
import { GraphNodeVm, GraphVm, TeamOptionVm, TeamRowVm } from './interfaces/planning-vm.interfaces';
import {
  buildGraphEdges,
  buildGraphNodes,
  buildLevelMap,
  buildNodePositions,
  buildOrderById,
  calculateGraphDimensions,
  collectFocusLinks,
  groupItemsByLevel,
} from './utils/planning-graph.utils';

@Injectable({ providedIn: 'root' })
export class PlanningViewModelService {
  buildTeamOptions(scenario: NormalizedScenario | null): TeamOptionVm[] {
    if (!scenario) {
      return [];
    }
    return this.flattenTeams(scenario.orgTree).map((row) => ({ id: row.id, name: row.name }));
  }

  buildTreeRows(
    scenario: NormalizedScenario | null,
    result: PlanningResult | null,
    collapsedTeamIds: Set<string>,
  ): TeamRowVm[] {
    if (!scenario || !result) {
      return [];
    }

    const usedByTeamName = new Map<string, number>();
    for (const step of result.scheduled) {
      usedByTeamName.set(step.team, (usedByTeamName.get(step.team) ?? 0) + step.effort);
    }

    return this.flattenTeams(scenario.orgTree)
      .map((row) => ({ ...row, used: usedByTeamName.get(row.name) ?? 0 }))
      .filter((row) => row.ancestorIds.every((parentId) => !collapsedTeamIds.has(parentId)));
  }

  filterExecution(
    result: PlanningResult | null,
    selectedTeamId: string,
    teamOptions: TeamOptionVm[],
  ): PlannedStep[] {
    if (!result) {
      return [];
    }
    if (selectedTeamId === 'all') {
      return result.scheduled;
    }

    const teamName = teamOptions.find((team) => team.id === selectedTeamId)?.name ?? '';
    return result.scheduled.filter((step) => step.team === teamName);
  }

  filterBlocked(
    result: PlanningResult | null,
    scenario: NormalizedScenario | null,
    selectedTeamId: string,
  ): PlanningItem[] {
    if (!result || !scenario) {
      return [];
    }
    if (selectedTeamId === 'all') {
      return result.blocked;
    }

    const selectedSkills = this.teamSkillsById(scenario.orgTree, selectedTeamId);
    return result.blocked.filter((item) => item.skills.some((skill) => selectedSkills.has(skill)));
  }

  buildGraph(
    result: PlanningResult | null,
    scenario: NormalizedScenario | null,
    focusId: string | null,
  ): GraphVm {
    if (!result || !scenario) {
      return this.emptyGraph();
    }

    const allItems = Object.values(scenario.itemsById);
    const orderById = buildOrderById(result.scheduled);
    const levelById = buildLevelMap(allItems, scenario);
    const itemsByLevel = groupItemsByLevel(allItems, levelById, orderById);
    const focusLinks = collectFocusLinks(allItems, focusId);
    const nodePosition = buildNodePositions(itemsByLevel);

    const nodes = buildGraphNodes(
      allItems,
      result,
      orderById,
      levelById,
      focusId,
      focusLinks,
      nodePosition,
    );
    const edges = buildGraphEdges(allItems, focusId, nodePosition);
    const { width, height } = calculateGraphDimensions(itemsByLevel);

    return { nodes, edges, width, height };
  }

  findSelectedNode(graph: GraphVm, selectedNodeId: string | null): GraphNodeVm | null {
    if (!selectedNodeId) {
      return null;
    }
    return graph.nodes.find((node) => node.id === selectedNodeId) ?? null;
  }

  private flattenTeams(root: TeamTreeNode): TeamRowVm[] {
    const rows: TeamRowVm[] = [];
    const walk = (
      node: TeamTreeNode,
      depth: number,
      isLast: boolean,
      ancestorIds: string[],
      ancestorHasNext: boolean[],
    ) => {
      rows.push({
        id: node.id,
        name: node.name,
        depth,
        capacity: node.capacity,
        used: 0,
        hasChildren: node.children.length > 0,
        isLast,
        ancestorIds,
        ancestorHasNext,
      });

      const nextAncestorIds = [...ancestorIds, node.id];
      const nextAncestorHasNext = [...ancestorHasNext, !isLast];
      node.children.forEach((child, index) =>
        walk(
          child,
          depth + 1,
          index === node.children.length - 1,
          nextAncestorIds,
          nextAncestorHasNext,
        ),
      );
    };

    root.children.forEach((child, index) =>
      walk(child, 0, index === root.children.length - 1, [], []),
    );
    return rows;
  }

  private teamSkillsById(root: TeamTreeNode, teamId: string): Set<string> {
    let found: Set<string> = new Set<string>();
    const walk = (node: TeamTreeNode) => {
      if (node.id === teamId) {
        found = new Set(node.skills);
      }
      node.children.forEach((child) => walk(child));
    };
    walk(root);
    return found;
  }

  private emptyGraph(): GraphVm {
    return { nodes: [], edges: [], width: 1000, height: 340 };
  }
}
