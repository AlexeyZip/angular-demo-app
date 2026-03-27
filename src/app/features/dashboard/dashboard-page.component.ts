import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UiButtonComponent, UiInputComponent } from 'ui';
import { I18nPipe } from '../../core/i18n/i18n.pipe';
import { I18nService } from '../../core/i18n/i18n.service';
import { filterBySearchQuery } from '../../core/utils/search-text';
import { DashboardFacade } from './state/dashboard.facade';
import { DashboardSummaryPresenter } from './presenters/dashboard-summary.presenter';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    RouterLink,
    UiButtonComponent,
    UiInputComponent,
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

  constructor() {
    this.localSearch.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((v) => this.query.set(v));
  }

  ngOnInit(): void {
    this.facade.enter();
  }
}
