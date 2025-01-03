import { computed, Injectable, signal } from '@angular/core';
import { ToastState, ToastContent } from '../interfaces/toast.interface';
import { map, merge, Subject } from 'rxjs';
import { connect } from 'ngxtension/connect';

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
  private displayToast$ = new Subject<ToastContent>();

  constructor() {
    // reducers
    const updatedState$ = merge(
      this.hideToast$.pipe(map((hide) => ({ visible: hide }))),
      this.displayToast$.pipe(map((content) => ({
        message: content.message,
        visible: true,
        toastType: content.toastType
      }))),
    );
    
    connect(this.state).with(updatedState$);
  }

  // Actions
  displayToastWithMessage = (toastContent: ToastContent): void => this.displayToast$.next(toastContent);
  hideToast = (hide: boolean): void => this.hideToast$.next(hide);
}
