import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnDestroy, output } from '@angular/core';
import { IconsService } from '../../../shared/services/icons.service';
import { ToastType } from '../../../shared/interfaces/toast.interface';
import { ToastService } from '../../../shared/services/toast.service';
import { Subject, takeUntil, tap, timeout, timer } from 'rxjs';

@Component({
  selector: 'dashboard-toast',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './toast.component.css',
  template: `
    <div 
      class="toast-wrapper flex"
      [ngClass]="[
        toastType() === 'success' ? 'wrapper-success': 'wrapper-failure',
        toastVisible() === true ? 'show' : 'hide'
      ]"
    >
      <div 
        class="icon-wrapper"
        [ngClass]="toastType() === 'success' ? 'icon-success' :'icon-failure'"
      >
        <div [innerHTML]="this.iconsService.getIcon(toastType() === 'success' ? 'success' : 'failure')"></div>
      </div>
      <div class="message">{{toastMessage() }}</div>
      <button 
        type="button" 
        class="btn" 
        (click)="closeToast.emit()"
      >
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    </div>
  `,
})
export class ToastComponent implements OnDestroy{
  // Services
  iconsService = inject(IconsService);
  toastService = inject(ToastService)

  // Properties
  toastVisible = computed<boolean>(() => this.toastService.toastVisible());
  toastType = computed<ToastType>(() => this.toastService.toastType());
  toastMessage = computed<string | null>(() => this.toastService.toastMessage());
  closeToast = output<void>();
  private destroyRef$ = new Subject<void>();

  constructor() {
    effect(() => {
      if(this.toastVisible()) {
        // Going for an observable instead of a signal so that we can handle the user navigating away.
        timer(5000)
          .pipe(takeUntil(this.destroyRef$))
          .subscribe(() => this.closeToast.emit());
      }
    })
  }

  ngOnDestroy(): void {
    this.destroyRef$.next();
    this.destroyRef$.complete();
  }
}
