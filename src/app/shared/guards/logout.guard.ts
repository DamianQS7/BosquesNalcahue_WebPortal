import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../auth/data-access/auth.service';

export const logoutGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);

  if (authService.status() === 'authenticated') {
    authService.logout();
    return true;
  }

  return true;
};
