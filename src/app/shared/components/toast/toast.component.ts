import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, output } from '@angular/core';
import { IconsService } from '../../../shared/services/icons.service';
import { ToastType } from '../../../shared/interfaces/toast.interface';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'dashboard-toast',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './toast.component.css',
  template: `
    <div 
      class="toast-wrapper flex"
      [class.show]="toastVisible()"
      [ngClass]="toastType() === 'success'? 'wrapper-success': 'wrapper-failure'"
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
export class ToastComponent {
  // Services
  iconsService = inject(IconsService);
  toastService = inject(ToastService)

  // Properties
  toastVisible = computed<boolean>(() => this.toastService.toastVisible());
  toastType = computed<ToastType>(() => this.toastService.toastType());
  toastMessage = computed<string | null>(() => this.toastService.toastMessage());
  closeToast = output<void>();

  constructor() {
    effect(() => {
      if(this.toastVisible()) {
        this.triggerTimeOut(3000);
      }
    })
  } 

  private triggerTimeOut(duration: number): void {
    setTimeout(() => {
      this.closeToast.emit();
    }, duration)
  }
}
