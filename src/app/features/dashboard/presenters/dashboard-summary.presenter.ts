import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DashboardSummaryDto } from '../../../core/services/dashboard-api.service';
import { I18nPipe } from '../../../core/i18n/i18n.pipe';

/**
 * «Глупый» компонент (View): только входные данные, без Store.
 */
@Component({
  selector: 'app-dashboard-summary-presenter',
  standalone: true,
  templateUrl: './dashboard-summary.presenter.html',
  styleUrl: './dashboard-summary.presenter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, DatePipe, I18nPipe],
})
export class DashboardSummaryPresenter {
  readonly summary = input<DashboardSummaryDto | null>(null);
}
