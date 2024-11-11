import { effect, inject, Injectable, signal } from '@angular/core';
import { BrowserStorageService } from './browser-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private storageService: BrowserStorageService = inject(BrowserStorageService);

  public isDarkTheme = signal<boolean>(
    this.storageService.getLocalStorage('theme') === 'dark' || 
    (this.storageService.getLocalStorage('theme') === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  constructor() {
    effect(() => {
      document.documentElement.classList.toggle('dark', this.isDarkTheme());
      document.documentElement.classList.toggle('bg-slate-800', this.isDarkTheme());
      this.storageService.setLocalStorage('theme', this.isDarkTheme() ? 'dark' : 'light');
    });
  }
}
