import { Component, computed, EventEmitter, input, InputSignal, output, Output, Signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationInfo } from '../../interfaces';

@Component({
  selector: 'dashboard-pagination-nav',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './pagination-nav.component.css',
  template: `
    <nav class="pagination-wrapper" aria-label="Pagination">
      <span class="pagination-info">
          Mostrando 
          <span class="pagination-info-span">{{startIndex()}}-{{endIndex()}}</span> 
          de 
          <span class="pagination-info-span">{{paginationInfo().totalCount}}</span>
      </span>
      <ul class="pagination-list">
          <li class="pagination-item rounded-s-lg"
              (click)="toNextOrPrevPage.emit(hasPreviousPage())">
              Anterior
          </li>
          @for (page of totalPages(); track $index) {
              <li class="pagination-item" 
                  (click)="toSelectedPage.emit(page)"
                  [ngClass]="{'active': currentPage() === page}">
                  {{page}}
              </li>
          }
          <li class="pagination-item rounded-e-lg"
              (click)="toNextOrPrevPage.emit(hasNextPage())">
            Siguiente
          </li>
      </ul>
  </nav>
  `,
})
export class PaginationNavComponent {
  // Properties
  paginationInfo   = input.required<PaginationInfo>();
  currentPage      = input.required<number>();
  toSelectedPage   = output<number>();
  toNextOrPrevPage = output<number>();

  // Computed State
  startIndex = computed(() => (this.currentPage() - 1) * this.paginationInfo().pageSize + 1);
  endIndex = computed(() => Math.min(this.currentPage() * this.paginationInfo().pageSize, this.paginationInfo().totalCount));
  hasPreviousPage = computed<number>(() => this.currentPage() > 1 ? -1 : 0);
  hasNextPage = computed<number>(() => this.paginationInfo().hasNextPage ? 1 : 0);
  totalPages = computed(() => {
    let pagesNumber = Math.ceil(this.paginationInfo().totalCount / this.paginationInfo().pageSize);
    const pagesArray = Array.from({length: pagesNumber}, (_, i) => i + 1);
    return pagesArray;
  });
}
