import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { I18nPipe } from '../../core/i18n/i18n.pipe';
import { PlanningFacade } from './planning.facade';
import { PlanningStrategyType } from './domain/planning.strategy';
import { TeamOptionVm, TeamRowVm } from './interfaces/planning-vm.interfaces';
import { PlanningViewModelService } from './planning-view-model.service';

@Component({
  selector: 'app-planning-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, I18nPipe],
  templateUrl: './planning-page.component.html',
  styleUrl: './planning-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanningPageComponent {
  private readonly facade = inject(PlanningFacade);
  private readonly vm = inject(PlanningViewModelService);
  readonly strategyControl = new FormControl<PlanningStrategyType>('balanced', { nonNullable: true });
  readonly teamControl = new FormControl<string>('all', { nonNullable: true });
  private readonly selectedTeam = signal('all');
  private readonly collapsedTeamIds = signal<Set<string>>(new Set<string>());
  private readonly hoverNodeId = signal<string | null>(null);
  private readonly selectedNodeId = signal<string | null>(null);

  readonly result = this.facade.resultVm;
  readonly scenario = this.facade.scenarioVm;
  readonly loading = this.facade.loadingVm;
  readonly error = this.facade.errorVm;
  readonly teamOptions = computed<TeamOptionVm[]>(() => {
    return this.vm.buildTeamOptions(this.scenario());
  });

  readonly treeRows = computed<TeamRowVm[]>(() => {
    return this.vm.buildTreeRows(this.scenario(), this.result(), this.collapsedTeamIds());
  });

  readonly filteredExecution = computed(() => {
    return this.vm.filterExecution(this.result(), this.selectedTeam(), this.teamOptions());
  });

  readonly filteredBlocked = computed(() => {
    return this.vm.filterBlocked(this.result(), this.scenario(), this.selectedTeam());
  });

  readonly graph = computed(() => {
    const focusId = this.selectedNodeId() ?? this.hoverNodeId();
    return this.vm.buildGraph(this.result(), this.scenario(), focusId);
  });

  readonly selectedNode = computed(() => {
    return this.vm.findSelectedNode(this.graph(), this.selectedNodeId());
  });

  constructor() {
    this.strategyControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((strategy) => this.facade.rebuild(strategy));

    this.teamControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((teamId) => this.selectedTeam.set(teamId));

    this.facade.loadAndBuild(this.strategyControl.value);
  }

  rerun(): void {
    this.facade.rebuild(this.strategyControl.value);
  }

  onNodeHover(nodeId: string | null): void {
    this.hoverNodeId.set(nodeId);
  }

  onNodeClick(nodeId: string): void {
    this.selectedNodeId.update((current) => (current === nodeId ? null : nodeId));
  }

  onNodeKeydown(event: KeyboardEvent, nodeId: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onNodeClick(nodeId);
    }
  }

  toggleTeam(row: TeamRowVm): void {
    if (!row.hasChildren) {
      return;
    }
    this.collapsedTeamIds.update((current) => {
      const next = new Set(current);
      if (next.has(row.id)) {
        next.delete(row.id);
      } else {
        next.add(row.id);
      }
      return next;
    });
  }

  isCollapsed(teamId: string): boolean {
    return this.collapsedTeamIds().has(teamId);
  }
}
