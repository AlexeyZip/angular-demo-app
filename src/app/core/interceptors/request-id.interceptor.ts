import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { retry, tap } from 'rxjs';
import { LoggerService } from '../logging/logger.service';

const requestId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();

export const requestIdInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const id = requestId();
  const enriched = req.clone({
    setHeaders: {
      'X-Request-Id': id,
    },
  });
  logger.debug('HTTP request started', { method: enriched.method, url: enriched.url, requestId: id });

  if (enriched.method === 'GET') {
    return next(enriched).pipe(
      retry({ count: 1, delay: 120 }),
      tap({
        next: () =>
          logger.debug('HTTP request finished', {
            method: enriched.method,
            url: enriched.url,
            requestId: id,
          }),
        error: (error) =>
          logger.warn('HTTP request failed', {
            method: enriched.method,
            url: enriched.url,
            requestId: id,
            error,
          }),
      }),
    );
  }

  return next(enriched).pipe(
    tap({
      next: () =>
        logger.debug('HTTP request finished', {
          method: enriched.method,
          url: enriched.url,
          requestId: id,
        }),
      error: (error) =>
        logger.warn('HTTP request failed', {
          method: enriched.method,
          url: enriched.url,
          requestId: id,
          error,
        }),
    }),
  );
};
