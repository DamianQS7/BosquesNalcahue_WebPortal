import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'charts-year-selector',
  standalone: true,
  imports: [],
  template: `
  <button class=" basic-style" (click)="goToPrevYear()">-</button>
  <span class="basic-style">{{ year() }}</span>
  <button class="basic-style" (click)="goToNextYear()">+</button>
  `,
  styles: `
    .basic-style { @apply dark:text-white mx-1 mt-1 mb-4 text-slate-600 rounded-md px-3 flex items-center }
    span { @apply bg-slate-200 dark:bg-slate-500 font-normal border border-slate-500 text-sm 2xl:text-xl  }
    button {
      @apply bg-slate-100 dark:shadow-sm shadow-md shadow-slate-600 font-semibold transition px-4 text-xl 2xl:text-2xl z-10 border-slate-500 border
      hover:shadow-slate-800 dark:hover:shadow-slate-200 hover:shadow-md dark:bg-slate-700
    }

  `,
  host: { class: `flex sm:justify-between` }
})
export class YearSelectorComponent {
  // Properties
  private readonly currentYear: number = new Date().getFullYear();
  private readonly minYear: number = 2024;
  year = signal<number>(new Date().getFullYear());

  // Events
  yearChanged = output<number>();

  // Methods
  goToNextYear = () => this.year.update(year => year + 1 > this.currentYear ? year : year + 1);
  goToPrevYear = () => this.year.update(year => year - 1 < this.minYear? year : year - 1);

  // Effects
  updateYearEffect = effect(() => this.yearChanged.emit(this.year()))
}
