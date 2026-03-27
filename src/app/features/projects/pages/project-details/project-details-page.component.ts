import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectEntityDetails } from '../../../../core/services/project-studio-api.service';
import { I18nPipe } from '../../../../core/i18n/i18n.pipe';

@Component({
  selector: 'app-project-details-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RouterLink, I18nPipe],
  templateUrl: './project-details-page.component.html',
  styleUrl: './project-details-page.component.scss',
})
export class ProjectDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly project = this.route.snapshot.data['project'] as ProjectEntityDetails;
}
