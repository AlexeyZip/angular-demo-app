import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CsrfService } from '../security/csrf.service';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return next(req);
  }

  const token = inject(CsrfService).csrfToken();
  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        'X-CSRF-Token': token,
      },
    }),
  );
};
