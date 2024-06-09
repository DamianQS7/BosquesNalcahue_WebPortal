import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input, input, output } from '@angular/core';
import { IconsService } from '../../../services/icons.service';

@Component({
  selector: 'dashboard-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  // Services
  public iconsService: IconsService = inject(IconsService);

  // Properties
  public toastType = input<'success' | 'failure'>('success');
  public isVisible = input<boolean>(false);
  public toastTimedOut = output<boolean>();
  @Input() public failureMessage: string = 'No se pudo enviar el reporte.';
  @Input() public successMessage: string = 'Reporte actualizado con exito.';


  constructor() {
    effect(() => {
      if(this.isVisible()) {
        console.log(this.isVisible());
        
        this.triggerTimeOut();
      }
    })
  } 

  public closeToast(): void {
    this.toastTimedOut.emit(false);
  }

  private triggerTimeOut(): void {
    setTimeout(() => {
      this.toastTimedOut.emit(false);
    }, 5000)
  }
}
