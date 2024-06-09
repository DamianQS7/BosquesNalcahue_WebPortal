import { CommonModule } from '@angular/common';
import { Component, Input, input, output } from '@angular/core';

@Component({
  selector: 'dashboard-modal',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  public isVisible = input<boolean>(false);
  public closeModalEvent = output<boolean>();
  public modalNotification = output<boolean>();

  public onDeleteBtnClick(): void {
    this.modalNotification.emit(true);
    this.closeModal();
  }

  public closeModal(): void {
    this.closeModalEvent.emit(false);
  }
}
