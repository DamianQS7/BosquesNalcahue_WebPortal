import { computed, inject, Injectable, signal } from '@angular/core';
import { ToastState, ToastContent } from '../interfaces/toast.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Subject } from 'rxjs';
import { AuthService } from '../../auth/data-access/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private authService = inject(AuthService);

  // state
  private state = signal<ToastState>({
    toastType: 'success',
    message: null,
    visible: false
  });

  // selectors
  toastType = computed(() => this.state().toastType);
  toastVisible = computed(() => this.state().visible);
  toastMessage = computed(() => this.state().message);

  // sources
  private hideToast$ = new Subject<boolean>();
  private displayToast$ = new Subject<ToastContent>()
  private authError$ = this.authService.error$;

  constructor() {
    // reducers
    this.displayToast$.pipe(takeUntilDestroyed()).subscribe(toastContent => 
      this.state.update(() => ({
        message: toastContent.message,
        visible: true,
        toastType: toastContent.toastType
      }))
    );

    this.hideToast$.pipe(takeUntilDestroyed()).subscribe(hide => 
      this.state.update(state => ({ ...state, visible: hide }))
    );

    this.authError$.pipe(takeUntilDestroyed()).subscribe(error => 
      this.state.update(() => ({
        message: 'Hay un error con las credenciales introducidas.',
        visible: true,
        toastType: 'failure' as const
      }))
    );
  }

  // actions
  displayToastWithMessage(toastContent: ToastContent): void {
    this.displayToast$.next(toastContent);
  }

  hideToast(hide: boolean): void {
    this.hideToast$.next(hide);
  }
}
