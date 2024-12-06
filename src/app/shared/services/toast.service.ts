import { computed, Injectable, signal } from '@angular/core';
import { ToastState, ToastContent } from '../interfaces/toast.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

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
  }

  // actions
  displayToastWithMessage(toastContent: ToastContent): void {
    this.displayToast$.next(toastContent);
  }

  hideToast(hide: boolean): void {
    this.hideToast$.next(hide);
  }
}
