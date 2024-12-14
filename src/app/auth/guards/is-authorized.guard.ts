import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

export const isAuthorizedGuard: CanActivateFn = (route, state) => {
  
  const authService  = inject(AuthService);
  const toastService = inject(ToastService);
  
  if (authService.status() === 'authenticated' && authService.isAuthorized()) {
    return true;
  }

  toastService.displayToastWithMessage({
    toastType: 'failure', 
    message: 'El acceso a esta ruta esta restringido.'
  });
  return false;
};
