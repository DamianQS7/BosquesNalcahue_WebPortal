import { effect, inject, Injectable, signal } from '@angular/core';
import { BrowserStorageService } from './browser-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private storageService = inject(BrowserStorageService);

  public isDarkTheme = signal<boolean>(
    this.storageService.getFromLocalStorage('theme') === 'dark' || 
    (this.storageService.getFromLocalStorage('theme') === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  constructor() {
    effect(() => {
      document.documentElement.classList.toggle('dark', this.isDarkTheme());
      document.documentElement.classList.toggle('bg-slate-800', this.isDarkTheme());
      this.storageService.setToLocalStorage('theme', this.isDarkTheme() ? 'dark' : 'light');
    });
  }
}
