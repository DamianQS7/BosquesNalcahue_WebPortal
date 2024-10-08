import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const userAuthenticated = inject(AuthService).isAuthenticated();
  const router = inject(Router);
  
  if (userAuthenticated) {
    return true;
  }

  return router.navigateByUrl('login');
};
