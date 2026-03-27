import { CurrencyPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import {
  AnalyticsOverviewDto,
  AnalyticsProjectRowDto,
} from '../../core/services/analytics-api.service';
import {
  CategoryScale,
  Chart,
  DoughnutController,
  ArcElement,
  Legend,
  LineController,
  LineElement,
  BarController,
  BarElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { I18nPipe } from '../../core/i18n/i18n.pipe';
import { I18nService } from '../../core/i18n/i18n.service';
import {
  buildBudgetChartConfig,
  buildRiskChartConfig,
} from './utils/analytics-chart.utils';
import { buildAnalyticsColumnDefs } from './utils/analytics-grid.utils';

ModuleRegistry.registerModules([AllCommunityModule]);

Chart.register(
  CategoryScale,
  DoughnutController,
  ArcElement,
  Legend,
  Tooltip,
  LineController,
  LineElement,
  BarController,
  BarElement,
  LinearScale,
  PointElement,
);

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [CurrencyPipe, AgGridAngular, I18nPipe],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly i18n = inject(I18nService);
  private readonly zone = inject(NgZone);
  readonly overview = this.route.snapshot.data[
    'overview'
  ] as AnalyticsOverviewDto;
  readonly agTheme = themeQuartz;

  @ViewChild('budgetCanvas', { static: true })
  budgetCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('riskCanvas', { static: true })
  riskCanvas!: ElementRef<HTMLCanvasElement>;
  private budgetChart: Chart<'bar'> | null = null;
  private riskChart: Chart<'doughnut'> | null = null;

  readonly defaultColDef: ColDef<AnalyticsProjectRowDto> = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  columnDefs: ColDef<AnalyticsProjectRowDto>[] = this.buildColumnDefs();

  constructor() {
    effect(() => {
      this.i18n.currentLang();
      this.columnDefs = buildAnalyticsColumnDefs((key) =>
        this.i18n.translate(key),
      );
      if (this.budgetChart && this.riskChart) {
        this.renderBudgetChart();
        this.renderRiskChart();
      }
    });
  }

  ngAfterViewInit(): void {
    this.renderBudgetChart();
    this.renderRiskChart();
  }

  ngOnDestroy(): void {
    this.budgetChart?.destroy();
    this.riskChart?.destroy();
  }

  private renderBudgetChart(): void {
    this.zone.runOutsideAngular(() => {
      this.budgetChart?.destroy();
      const cfg = buildBudgetChartConfig(
        this.overview.monthlyBudgetTrend,
        (key) => this.i18n.translate(key),
      );
      this.budgetChart = new Chart(this.budgetCanvas.nativeElement, cfg);
    });
  }

  private renderRiskChart(): void {
    this.zone.runOutsideAngular(() => {
      this.riskChart?.destroy();

      const cfg = buildRiskChartConfig(this.overview.riskDistribution, (key) =>
        this.i18n.translate(key),
      );

      this.riskChart = new Chart(this.riskCanvas.nativeElement, cfg);
    });
  }

  private buildColumnDefs(): ColDef<AnalyticsProjectRowDto>[] {
    return buildAnalyticsColumnDefs((key) => this.i18n.translate(key));
  }
}
