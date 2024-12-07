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

  private readonly USER_KEY: string = 'currentUser';
  private readonly ACCESS_TOKEN_KEY: string = 'accessToken';
  private readonly REFRESH_TOKEN_KEY: string = 'refreshToken';

  private localStorage = inject(STORAGE_TOKENS.LOCAL);
  private sessionStorage = inject(STORAGE_TOKENS.SESSION);

  getCurrentUser(): string | null {
    return this.sessionStorage.getItem(this.USER_KEY);
  }

  storeCurrentUser(user: User): void {
    this.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  removeUserSession(): void {
    this.sessionStorage.clear();
    this.localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  storeUserSession(accessToken: string, user: User, refreshToken: string): void {
    this.sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    this.localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    this.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  storeAccessToken(token: string): void {
    this.sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  getAccessToken(): string | null {
    return this.sessionStorage.getItem(this.ACCESS_TOKEN_KEY);;
  }

  getRefreshToken(): string | null {
    return this.localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getLocalStorage(key: string): string | null {
    return this.localStorage.getItem(key)
  }

  setLocalStorage(key: string, value: string): void {
    this.localStorage.setItem(key, value)
  }
}
