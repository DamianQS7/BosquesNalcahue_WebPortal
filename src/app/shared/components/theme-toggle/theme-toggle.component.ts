import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';

@Component({
  selector: 'shared-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
  host: {
    class: 'flex flex-row w-[35%] 2xl:w-[38%] p-[0.15rem] rounded-3xl border border-slate-300',
    '[class.bg-teal-100/70]': 'isDarkTheme()',
    '[class.bg-neutral-200]': '!isDarkTheme()'
  }
})
export class ThemeToggleComponent {
  public isDarkTheme = signal<boolean>(
    localStorage.getItem('theme') === 'dark' || 
    (localStorage.getItem('theme') === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  constructor() {
    // Update the class on the document element when theme changes
    effect(() => {
      document.documentElement.classList.toggle('dark', this.isDarkTheme());
      document.documentElement.classList.toggle('bg-slate-800', this.isDarkTheme());
      localStorage.setItem('theme', this.isDarkTheme() ? 'dark' : 'light');
    });
  }

  toggleTheme() {
    this.isDarkTheme.update(value => !value);
  }
}
