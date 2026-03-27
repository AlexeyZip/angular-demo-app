import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UiButtonComponent } from 'ui';
import { I18nPipe } from '../core/i18n/i18n.pipe';
import { SessionAuthService } from './session-auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [UiButtonComponent, RouterLink, I18nPipe],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly auth = inject(SessionAuthService);
  private readonly router = inject(Router);

  login(): void {
    this.auth.login();
    void this.router.navigateByUrl('/users');
  }
}
