import { inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { User } from '../../auth/interfaces/user.interface';
import { isPlatformBrowser } from '@angular/common';

export const STORAGE_TOKENS = {
  LOCAL: new InjectionToken<Storage>(
    'window local storage object',
    {
      providedIn: 'root',
      factory: () => 
        isPlatformBrowser(inject(PLATFORM_ID))
        ? window.localStorage
        : ({} as Storage)
    }
  ),
  SESSION: new InjectionToken<Storage>(
    'window session storage object',
    {
      providedIn: 'root',
      factory: () =>
        isPlatformBrowser(inject(PLATFORM_ID))
        ? window.sessionStorage
        : ({} as Storage)
    }
  )
};

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
