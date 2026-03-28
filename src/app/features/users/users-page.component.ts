import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UiButtonComponent, UiInputComponent } from 'ui';
import { I18nPipe } from '../../core/i18n/i18n.pipe';
import { UsersFacade } from './state/users.facade';
import { UsersTablePresenter } from './presenters/users-table.presenter';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [ReactiveFormsModule, UiButtonComponent, UiInputComponent, UsersTablePresenter, I18nPipe],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {
  readonly facade = inject(UsersFacade);
  readonly filter = new FormControl<string>('', { nonNullable: true });

  readonly users = toSignal(this.facade.users$, { initialValue: [] });
  readonly loadError = toSignal(this.facade.loadError$, { initialValue: null });

  constructor() {
    this.filter.valueChanges
      .pipe(debounceTime(150), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((q) => this.facade.setFilter(q));
  }
}
