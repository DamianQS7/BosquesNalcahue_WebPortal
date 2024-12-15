import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../data-access/auth.service';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = 
(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  
  const authService = inject(AuthService);

  if (authService.accessToken()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.accessToken()}`
      }
    });
  }

  return next(req).pipe(
    catchError(err => {
      if (err.status === 401 && authService.accessToken()) {
        console.log('Refreshing Token from Interceptor');
        return authService.refresh().pipe(
          switchMap(res => {
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${authService.accessToken()}`
              }
            });

            return next(newReq);
          }),
          catchError(refreshError => {
            authService.logout();
            authService.error$.next(refreshError);
            return throwError(() => refreshError);
          })
        );
      } 

      return throwError(() => err);
    })
  );
};
