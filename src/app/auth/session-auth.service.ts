import { Injectable, signal } from '@angular/core';

const KEY = 'enterprise-demo-session';

/**
 * Lightweight demo session storage for route-guard behavior.
 */
@Injectable({ providedIn: 'root' })
export class SessionAuthService {
  private readonly authed = signal(this.readStorage());

  isAuthenticated(): boolean {
    return this.authed();
  }

  login(): void {
    sessionStorage.setItem(KEY, '1');
    this.authed.set(true);
  }

  logout(): void {
    sessionStorage.removeItem(KEY);
    this.authed.set(false);
  }

  private readStorage(): boolean {
    return sessionStorage.getItem(KEY) === '1';
  }
}
