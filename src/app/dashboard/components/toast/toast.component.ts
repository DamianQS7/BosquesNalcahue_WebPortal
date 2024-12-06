import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input, input, output } from '@angular/core';
import { IconsService } from '../../../shared/services/icons.service';
import { ToastType } from '../../../shared/interfaces/toast.interface';


@Component({
  selector: 'dashboard-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  // Services
  iconsService: IconsService = inject(IconsService);

  // Properties
  toastVisible = input.required<boolean>();
  toastType = input.required<ToastType>();
  toastMessage = input.required<string | null>();
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
