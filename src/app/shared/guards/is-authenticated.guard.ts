import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/data-access/auth.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const userAuthStatus = inject(AuthService).status();
  const router = inject(Router);
  
  if (userAuthStatus === 'authenticated') {
    return true;
  }

  return router.navigateByUrl('login');
};
