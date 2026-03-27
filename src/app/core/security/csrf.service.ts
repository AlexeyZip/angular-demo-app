import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { CsrfTokenResponse } from './interfaces/csrf.interfaces';

@Injectable({ providedIn: 'root' })
export class CsrfService {
  private readonly token = signal<string | null>(null);
  readonly csrfToken = this.token.asReadonly();

  constructor(private readonly http: HttpClient) {}

  async init(): Promise<void> {
    if (this.isStaticPagesHost()) {
      this.token.set(null);
      return;
    }

    const token = await firstValueFrom(
      this.http.get<CsrfTokenResponse>('/api/security/csrf-token').pipe(
        map((r) => r.token),
        catchError(() => of(null)),
      ),
    );
    this.token.set(token ?? null);
  }

  private isStaticPagesHost(): boolean {
    const host = globalThis.location?.hostname ?? '';
    return host.endsWith('github.io');
  }
}
