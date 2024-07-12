import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public modalVisible = signal<boolean>(false);
  
  public showModal(): void {
    this.modalVisible.set(true);
  }

  public hideModal(): void {
    this.modalVisible.set(false);
  }
}
