import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'dashboard-search-box',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrl: './search-box.component.css',
  template: `
    <label for="table-search" class="sr-only">Search</label>
    <div class="relative">
      <div class="icon-wrapper">
        <svg class="icon" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
        </svg>
      </div>
      <input 
        type="text" 
        class="input-box" 
        [placeholder]="placeholder()"
        [formControl]="searchControl">
    </div>
  `,
})
export class SearchBoxComponent {

  // Properties
  placeholder = input<string>('');
  onDebounce = output<string>();
  searchControl = new FormControl();

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe((value) => this.onDebounce.emit(value!));
  }
}
