import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

const STORAGE_KEY = 'enterprise-demo-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly theme = signal<AppTheme>(this.readInitial());
  readonly currentTheme = this.theme.asReadonly();

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.applyTheme(this.theme());
  }

  setTheme(theme: AppTheme): void {
    this.theme.set(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'light' ? 'dark' : 'light');
  }

  private readInitial(): AppTheme {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === 'light' || value === 'dark') {
      return value;
    }
    return 'light';
  }

  private applyTheme(theme: AppTheme): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}
