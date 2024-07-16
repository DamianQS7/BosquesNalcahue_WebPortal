import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const notAuthenticatedGuard: CanActivateFn = (route, state) => {
  console.log('notAuthenticatedGuard, IsAuthenticated signal from authService',inject(AuthService).isAuthenticated());
  
  return true;
};
