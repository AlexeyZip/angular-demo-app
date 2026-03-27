import { Injectable, computed, inject, signal } from '@angular/core';
import { take } from 'rxjs';
import { TraceExecution } from '../../core/meta/trace.decorator';
import { PlanningApiService } from '../../core/services/planning-api.service';
import { PlanningEngine, PlanningResult } from './domain/planning-engine';
import { ScenarioFactory, NormalizedScenario } from './domain/scenario.factory';
import { PlanningStrategyType, StrategyFactory } from './domain/planning.strategy';

@Injectable({ providedIn: 'root' })
export class PlanningFacade {
  private readonly api = inject(PlanningApiService);
  private readonly scenarioFactory = inject(ScenarioFactory);
  private readonly strategyFactory = inject(StrategyFactory);

  private readonly scenario = signal<NormalizedScenario | null>(null);
  private readonly result = signal<PlanningResult | null>(null);
  private readonly loading = signal(false);
  private readonly error = signal<string | null>(null);

  readonly resultVm = this.result.asReadonly();
  readonly scenarioVm = this.scenario.asReadonly();
  readonly loadingVm = this.loading.asReadonly();
  readonly errorVm = this.error.asReadonly();
  readonly hasData = computed(() => !!this.result());

  @TraceExecution('planning')
  loadAndBuild(strategyType: PlanningStrategyType): void {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .getScenario()
      .pipe(take(1))
      .subscribe({
        next: (dto) => {
          const normalized = this.scenarioFactory.create(dto);
          this.scenario.set(normalized);
          const strategy = this.strategyFactory.create(strategyType);
          this.result.set(PlanningEngine.buildPlan(normalized, strategy));
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load planning scenario');
          this.loading.set(false);
        },
      });
  }

  @TraceExecution('planning')
  rebuild(strategyType: PlanningStrategyType): void {
    const normalized = this.scenario();
    if (!normalized) {
      this.loadAndBuild(strategyType);
      return;
    }
    const strategy = this.strategyFactory.create(strategyType);
    this.result.set(PlanningEngine.buildPlan(normalized, strategy));
  }
}
