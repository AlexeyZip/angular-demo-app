import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionAuthService } from './session-auth.service';

export const sessionAuthCanActivate: CanActivateFn = () => {
  const auth = inject(SessionAuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
