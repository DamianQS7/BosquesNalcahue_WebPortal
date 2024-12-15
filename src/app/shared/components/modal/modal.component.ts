import { CommonModule } from '@angular/common';
import { Component, computed, inject, output } from '@angular/core';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'dashboard-modal',
  standalone: true,
  imports: [ CommonModule ],
  styleUrl: './modal.component.css',
  template: `
    @if (isVisible()) {
      <div class="modal-bg">
        <div class="modal-wrapper">
            <div class="modal">
                <button 
                  (click)="closeTrigger.emit()"
                  type="button" 
                  class="modal-close-btn"
                >
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
                <div class="p-4 md:p-5 text-center">
                  <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                  <h3 class="modal-text">
                    <ng-content select="main-content"></ng-content>
                  </h3>
                  <button 
                    (click)="actionTrigger.emit(true); closeTrigger.emit()"
                    type="button" 
                    class="modal-btn-primary"
                  >
                    <ng-content select="first-option">Si, confirmo.</ng-content>
                  </button>
                  <button 
                    (click)="closeTrigger.emit()"
                    type="button" 
                    class="modal-btn-secondary"
                  >
                    <ng-content select="second-option">No, regresar.</ng-content>
                  </button>
                </div>
            </div>
        </div>
      </div>
    } 
  `,
})
export class ModalComponent {
  private modalsService = inject(ModalService);
  public isVisible = computed(() => this.modalsService.visible());
  public actionTrigger = output<boolean>();
  public closeTrigger = output<void>();
}
