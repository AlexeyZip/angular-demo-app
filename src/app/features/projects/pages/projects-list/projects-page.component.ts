import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectEntitySummary } from '../../../../core/services/project-studio-api.service';
import { UiInputComponent } from 'ui';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { I18nPipe } from '../../../../core/i18n/i18n.pipe';
import { filterBySearchQuery } from '../../../../core/utils/search-text';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe, ReactiveFormsModule, RouterLink, UiInputComponent, I18nPipe],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly projects = signal<ProjectEntitySummary[]>(
    (this.route.snapshot.data['projects'] as ProjectEntitySummary[] | undefined) ?? [],
  );
  readonly searchControl = new FormControl('', { nonNullable: true });
  private readonly query = signal('');

  readonly filtered = computed(() => {
    return filterBySearchQuery(this.projects(), this.query(), (project) => [project.name, project.code]);
  });

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(150), takeUntilDestroyed())
      .subscribe((v) => this.query.set(v));
  }
}
