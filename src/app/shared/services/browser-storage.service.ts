import { inject, Injectable } from '@angular/core';
import { STORAGE_TOKENS } from '../utils/injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {

  private localStorage = inject(STORAGE_TOKENS.LOCAL);
  private sessionStorage = inject(STORAGE_TOKENS.SESSION);

  removeUserSession(refreshTokenKey: string): void {
    this.sessionStorage.clear();
    this.localStorage.removeItem(refreshTokenKey);
  }
  getFromLocalStorage(key: string): string | null {
    return this.localStorage.getItem(key)
  }

  setToLocalStorage(key: string, value: string): void {
    this.localStorage.setItem(key, value)
  }

  getFromSessionStorage(key: string): string | null {
    return this.sessionStorage.getItem(key);
  }

  setToSessionStorage(key: string, value: string): void {
    this.sessionStorage.setItem(key, value);
  }
}
