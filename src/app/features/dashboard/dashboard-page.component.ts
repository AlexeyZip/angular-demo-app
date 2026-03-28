import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UiButtonComponent, UiInputComponent, UiSurfaceComponent, UiTemplateListComponent } from 'ui';
import { I18nPipe } from '../../core/i18n/i18n.pipe';
import { I18nService } from '../../core/i18n/i18n.service';
import { filterBySearchQuery } from '../../core/utils/search-text';
import { IfHasDataDirective } from '../../shared/directives/if-has-data.directive';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';
import { DashboardFacade } from './state/dashboard.facade';
import { DashboardSummaryPresenter } from './presenters/dashboard-summary.presenter';
import {
  DashboardMilestoneDto,
  DashboardRiskProjectDto,
  DashboardWorkloadDto,
} from '../../core/services/dashboard-api.service';

type SpotlightVm = {
  id: string;
  route: string[];
  title: string;
  subtitle: string;
  badge: string;
  tooltip: string;
};

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    UiButtonComponent,
    UiInputComponent,
    UiSurfaceComponent,
    UiTemplateListComponent,
    IfHasDataDirective,
    TooltipDirective,
    I18nPipe,
    DashboardSummaryPresenter,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  readonly facade = inject(DashboardFacade);
  private readonly i18n = inject(I18nService);
  readonly localSearch = new FormControl<string>('', { nonNullable: true });
  readonly query = signal('');
  readonly insights = toSignal(this.facade.insights$, { initialValue: null });
  readonly summary = toSignal(this.facade.summary$, { initialValue: null });
  readonly status = toSignal(this.facade.status$, { initialValue: 'idle' });
  readonly loadError = toSignal(this.facade.error$, { initialValue: null });
  readonly apiHealthy = toSignal(this.facade.apiHealthy$, { initialValue: null });

  readonly highRisk = computed(() => {
    const data = this.insights()?.highRiskProjects ?? [];
    return filterBySearchQuery(data, this.query(), (item) => [item.name, item.code]);
  });

  readonly milestones = computed(() => {
    const data = (this.insights()?.upcomingMilestones ?? []).filter((x) => !x.done);
    return filterBySearchQuery(data, this.query(), (item) => [item.projectName, item.title]);
  });

  readonly workload = computed(() => {
    const data = this.insights()?.teamWorkload ?? [];
    return filterBySearchQuery(data, this.query(), (item) => [item.name, item.role]);
  });

  readonly healthLabel = computed(() => {
    if (this.apiHealthy() === true) {
      return this.i18n.translate('dashboard.api.ok');
    }
    if (this.apiHealthy() === false) {
      return this.i18n.translate('dashboard.api.down');
    }
    return this.i18n.translate('dashboard.api.checking');
  });

  readonly spotlightItems = computed<SpotlightVm[]>(() => {
    const riskItems = this.highRisk().map((item) => this.mapRiskSpotlight(item));
    if (riskItems.length > 0) {
      return riskItems;
    }

    const milestoneItems = this.milestones().slice(0, 5).map((item) => this.mapMilestoneSpotlight(item));
    if (milestoneItems.length > 0) {
      return milestoneItems;
    }

    return this.workload().slice(0, 5).map((item) => this.mapWorkloadSpotlight(item));
  });

  readonly pulseStats = computed(() => {
    const highRisk = this.highRisk().length;
    const milestones = this.milestones().length;
    const workload = this.workload();
    const overloaded = workload.filter((w) => w.utilization >= 85).length;
    const avgUtilization = workload.length
      ? Math.round(workload.reduce((sum, item) => sum + item.utilization, 0) / workload.length)
      : 0;
    return { highRisk, milestones, overloaded, avgUtilization };
  });

  constructor() {
    this.localSearch.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((v) => this.query.set(v));
  }

  ngOnInit(): void {
    this.facade.enter();
  }

  readonly trackBySpotlight = (_: number, item: unknown): string => (item as SpotlightVm).id;

  private mapRiskSpotlight(item: DashboardRiskProjectDto): SpotlightVm {
    return {
      id: `risk:${item.id}`,
      route: ['/projects', item.id],
      title: item.name,
      subtitle: `${item.code} · ${this.i18n.translate('dashboard.insights.highRisk')}`,
      badge: this.i18n.translate(`risk.${item.riskLevel}`),
      tooltip: `${item.code} · Budget: $${item.budget.toLocaleString()} · Updated: ${new Date(item.updatedAt).toLocaleDateString()}`,
    };
  }

  private mapMilestoneSpotlight(item: DashboardMilestoneDto): SpotlightVm {
    return {
      id: `milestone:${item.projectId}:${item.title}`,
      route: ['/projects', item.projectId],
      title: item.projectName,
      subtitle: item.title,
      badge: item.dueDate,
      tooltip: `${item.projectName} · ${item.title} · ${item.dueDate}`,
    };
  }

  private mapWorkloadSpotlight(item: DashboardWorkloadDto): SpotlightVm {
    return {
      id: `workload:${item.id}`,
      route: ['/users'],
      title: item.name,
      subtitle: `${item.role} · ${item.openTasks} ${this.i18n.translate('dashboard.insights.tasks').toLowerCase()}`,
      badge: `${item.utilization}%`,
      tooltip: `${item.name} · ${item.role} · ${item.openTasks} tasks`,
    };
  }
}
