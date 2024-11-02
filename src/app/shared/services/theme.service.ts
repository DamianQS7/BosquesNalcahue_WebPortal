import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

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
}
