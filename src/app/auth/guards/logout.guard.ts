import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const logoutGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    authService.closeUserSession();
    return true;
  }

  return true;
};
