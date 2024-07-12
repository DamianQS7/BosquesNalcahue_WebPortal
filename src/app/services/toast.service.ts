import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  public toastSuccessMessage = signal<string>('');
  public toastFailureMessage = signal<string>('');
  public toastVisible = signal<boolean>(false);
  public toastType = signal<'success' | 'failure'>('failure');

  public displayToast(type: 'success' | 'failure', message: string): void {
    this.toastType.set(type);

    if (type === 'success') {
      this.toastSuccessMessage.set(message);
    } else {
      this.toastFailureMessage.set(message);
    }

    this.ShowAndHideToast(true);
  }

  public ShowAndHideToast(showToast: boolean): void {
    this.toastVisible.set(showToast);
  }
}
