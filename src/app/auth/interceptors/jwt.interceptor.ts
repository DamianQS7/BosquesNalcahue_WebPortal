import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../data-access/auth.service';
import { catchError, firstValueFrom, Observable, switchMap, tap, throwError } from 'rxjs';

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
        authService.refresh();

        return new Observable<HttpEvent<unknown>>(subscriber => {
          const interval = setInterval(async () => {
            const token = authService.accessToken();
            if (token) {
              clearInterval(interval);
              try {
                const newReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${token}` }
                });
                const response = await firstValueFrom(next(newReq));
                subscriber.next(response);
                subscriber.complete();
              } catch (error) {
                subscriber.error(error);
              }
            }
          }, 100);

          // Cleanup on unsubscribe
          return () => clearInterval(interval);
        }).pipe(
          switchMap(() => next(req))
        );
      }
      return throwError(() => err);
    })
  );
};
