import { Injectable, isDevMode } from '@angular/core';
import log from 'loglevel';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  constructor() {
    log.setLevel(isDevMode() ? 'debug' : 'info');
  }

  debug(message: string, context?: unknown): void {
    log.debug(message, context ?? '');
  }

  info(message: string, context?: unknown): void {
    log.info(message, context ?? '');
  }

  warn(message: string, context?: unknown): void {
    log.warn(message, context ?? '');
  }

  error(message: string, context?: unknown): void {
    log.error(message, context ?? '');
  }
}
