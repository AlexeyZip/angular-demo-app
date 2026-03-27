import { Injectable } from '@angular/core';
import { PlanningItem } from './planning.model';

export type PlanningStrategyType = 'balanced' | 'value-first' | 'risk-first';

export interface PrioritizationStrategy {
  readonly type: PlanningStrategyType;
  score(item: PlanningItem): number;
}

class BalancedStrategy implements PrioritizationStrategy {
  readonly type: PlanningStrategyType = 'balanced';
  score(item: PlanningItem): number {
    return item.value * 2 - item.risk - item.effort * 0.3;
  }
}

class ValueFirstStrategy implements PrioritizationStrategy {
  readonly type: PlanningStrategyType = 'value-first';
  score(item: PlanningItem): number {
    return item.value * 3 - item.effort * 0.2;
  }
}

class RiskFirstStrategy implements PrioritizationStrategy {
  readonly type: PlanningStrategyType = 'risk-first';
  score(item: PlanningItem): number {
    return item.risk * 3 + item.value - item.effort * 0.4;
  }
}

@Injectable({ providedIn: 'root' })
export class StrategyFactory {
  create(type: PlanningStrategyType): PrioritizationStrategy {
    if (type === 'value-first') {
      return new ValueFirstStrategy();
    }
    if (type === 'risk-first') {
      return new RiskFirstStrategy();
    }
    return new BalancedStrategy();
  }
}
