import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SessionAuthService } from '../auth/session-auth.service';
import { UiButtonComponent } from 'ui';
import { I18nPipe } from '../core/i18n/i18n.pipe';
import { AppLanguage } from '../core/i18n/translations';
import { I18nService } from '../core/i18n/i18n.service';
import { ThemeService } from '../core/theme/theme.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, UiButtonComponent, I18nPipe],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  constructor(
    readonly auth: SessionAuthService,
    readonly i18n: I18nService,
    readonly theme: ThemeService,
  ) {}

  get languages(): AppLanguage[] {
    return this.i18n.availableLanguages;
  }

  logout(): void {
    this.auth.logout();
  }

  setLanguage(event: Event): void {
    const language = (event.target as HTMLSelectElement).value as AppLanguage;
    this.i18n.setLanguage(language);
  }
}
