import { Component, computed, effect, EventEmitter, input, InputSignal, Output, Signal, signal } from '@angular/core';
import { PaginationInfo } from '../../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dashboard-pagination-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination-nav.component.html',
  styleUrl: './pagination-nav.component.css'
})
export class PaginationNavComponent {

  // Properties
  public totalItems: InputSignal<number> = input.required<number>();
  public pageSize: InputSignal<number> = input.required<number>();
  public hasNextPage: InputSignal<boolean> = input.required<boolean>();
  public currentPage = signal<number>(1);
  public totalPages: Signal<number[]> = computed(() => {

    const pagesNumber = Math.ceil(this.totalItems() / this.pageSize());
    const pagesArray = Array.from({length: pagesNumber}, (_, i) => i + 1);
    return pagesArray;
  })
  
  @Output()
  public selectedPage: EventEmitter<number> = new EventEmitter();

  // Methods
  public onPageChanged(page: number): void {

    this.selectedPage.emit(page);
    this.currentPage.set(page);
  }
}
