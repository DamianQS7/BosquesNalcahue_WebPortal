import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'shared-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
  <button
      (click)="toggleTheme()"
      [class.translate-x-8]="getTheme()"
      aria-label="Toggle theme"
    >
      <!-- Sun icon for dark mode -->
      @if(!getTheme()) {
          <svg
              xmlns="http://www.w3.org/2000/svg"
              class="btn-icon text-yellow-200"
              fill="yellow"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
      }
        
        <!-- Moon icon for light mode -->
      @if(getTheme()) {
          <svg
              xmlns="http://www.w3.org/2000/svg"
              class="btn-icon text-sky-200"
              fill="lightblue"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
      }
  </button>
  `,
  styleUrl: './theme-toggle.component.css',
  host: {
    class: `flex flex-row w-[35%] 2xl:w-[38%] p-[0.15rem] rounded-3xl border border-slate-300 \
            hover:bg-yellow-100 dark:hover:bg-sky-200 transition-all duration-500 ease-out`,
    '[class.bg-teal-100/70]': 'this.themeService.isDarkTheme()',
    '[class.bg-neutral-200]': '!this.themeService.isDarkTheme()'
  }
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);

  getTheme = (): boolean => this.themeService.isDarkTheme();
  toggleTheme = (): void => this.themeService.isDarkTheme.update(value => !value);
}
