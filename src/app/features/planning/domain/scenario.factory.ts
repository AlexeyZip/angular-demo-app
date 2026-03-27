import { Injectable } from '@angular/core';
import { PlanningScenarioDto, PlanningTeamDto } from '../../../core/services/planning-api.service';
import { DirectedGraph } from './graph';
import { PlanningItem } from './planning.model';
import { TeamTreeNode, buildTeamTree } from './tree';

export interface NormalizedScenario {
  itemsById: Record<string, PlanningItem>;
  skillIndex: Map<string, Set<string>>;
  dependencyGraph: DirectedGraph;
  orgTree: TeamTreeNode;
}

function toTeamTreeNode(team: PlanningTeamDto): TeamTreeNode {
  return {
    id: team.id,
    name: team.name,
    capacity: team.capacity,
    skills: team.skills,
    children: (team.children ?? []).map(toTeamTreeNode),
  };
}

@Injectable({ providedIn: 'root' })
export class ScenarioFactory {
  create(input: PlanningScenarioDto): NormalizedScenario {
    const itemsById: Record<string, PlanningItem> = {};
    const skillIndex = new Map<string, Set<string>>();
    const dependencyGraph = new DirectedGraph();

    for (const item of input.items) {
      itemsById[item.id] = {
        id: item.id,
        title: item.title,
        effort: item.effort,
        value: item.value,
        risk: item.risk,
        skills: [...item.skills],
        dependsOn: [...item.dependsOn],
      };
      dependencyGraph.addNode(item.id);

      for (const skill of item.skills) {
        if (!skillIndex.has(skill)) {
          skillIndex.set(skill, new Set<string>());
        }
        skillIndex.get(skill)!.add(item.id);
      }
    }

    for (const item of input.items) {
      for (const dep of item.dependsOn) {
        dependencyGraph.addEdge(dep, item.id);
      }
    }

    const tree = buildTeamTree(input.teams.map(toTeamTreeNode));
    return {
      itemsById,
      skillIndex,
      dependencyGraph,
      orgTree: tree,
    };
  }
}
