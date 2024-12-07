import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  // state
  private isVisible = signal<boolean>(false);

  // selector
  visible = computed(() => this.isVisible());

  // actions  
  showModal(): void { this.isVisible.set(true); }
  hideModal(): void { this.isVisible.set(false); }
}
