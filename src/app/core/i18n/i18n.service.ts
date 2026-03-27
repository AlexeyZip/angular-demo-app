import { Injectable, signal } from '@angular/core';
import { AppLanguage, TranslationTree, translations } from './translations';

const STORAGE_KEY = 'enterprise-demo-lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly lang = signal<AppLanguage>(this.readInitial());
  readonly currentLang = this.lang.asReadonly();
  readonly availableLanguages: AppLanguage[] = ['ru', 'uk', 'en'];

  setLanguage(language: AppLanguage): void {
    this.lang.set(language);
    localStorage.setItem(STORAGE_KEY, language);
  }

  translate(key: string, params?: Record<string, string | number>): string {
    const resolved = this.resolveByPath(translations[this.lang()], key) ?? key;
    if (!params) {
      return resolved;
    }
    return Object.entries(params).reduce(
      (acc, [paramKey, value]) => acc.replaceAll(`{${paramKey}}`, String(value)),
      resolved,
    );
  }

  private readInitial(): AppLanguage {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === 'ru' || value === 'uk' || value === 'en') {
      return value;
    }
    return 'ru';
  }

  private resolveByPath(tree: TranslationTree, key: string): string | null {
    const parts = key.split('.');
    let cursor: TranslationTree | string | undefined = tree;

    for (const part of parts) {
      if (!cursor || typeof cursor === 'string') {
        return null;
      }
      cursor = cursor[part];
    }
    return typeof cursor === 'string' ? cursor : null;
  }
}
