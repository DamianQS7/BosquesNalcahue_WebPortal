import { Component, computed, EventEmitter, input, InputSignal, Output, Signal} from '@angular/core';
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
  public totalItems: InputSignal<number>   = input.required<number>();
  public pageSize: InputSignal<number>     = input.required<number>();
  public hasNextPage: InputSignal<boolean> = input.required<boolean>();
  public currentPage: InputSignal<number>  = input.required<number>();

  public startIndex: Signal<number> = computed(() => {
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  public endIndex: Signal<number> = computed(() => {
    return Math.min(this.currentPage() * this.pageSize(), this.totalItems());
  }); 

  public hasPreviousPage: Signal<boolean> = computed(() => {
    return this.currentPage() > 1;
  });
  
  public totalPages: Signal<number[]> = computed(() => {

    const pagesNumber = Math.ceil(this.totalItems() / this.pageSize());
    const pagesArray = Array.from({length: pagesNumber}, (_, i) => i + 1);
    return pagesArray;
  });
  
  @Output()
  public selectedPage: EventEmitter<number> = new EventEmitter();
  @Output()
  public nextPageEvent: EventEmitter<boolean> = new EventEmitter();
  @Output()
  public prevPageEvent: EventEmitter<boolean> = new EventEmitter();

  // Methods
  public onPageChanged(page: number): void {
    this.selectedPage.emit(page);
  }

  public nextPage(): void {
    this.nextPageEvent.emit(this.hasNextPage());
  }

  public previousPage(): void {
    this.prevPageEvent.emit(this.hasPreviousPage());
  }
}
