import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UserDto } from '../../../core/services/users-api.service';
import { I18nPipe } from '../../../core/i18n/i18n.pipe';

@Component({
  selector: 'app-users-table-presenter',
  standalone: true,
  templateUrl: './users-table.presenter.html',
  styleUrl: './users-table.presenter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [I18nPipe],
})
export class UsersTablePresenter {
  readonly users = input<UserDto[]>([]);
  readonly rowClick = output<string>();
}
