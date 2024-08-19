import { Injectable } from '@angular/core';
import { User } from '../../auth/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {

  private readonly USER_KEY: string = 'currentUser';
  private readonly ACCESS_TOKEN_KEY: string = 'accessToken';
  private readonly REFRESH_TOKEN_KEY: string = 'refreshToken';

  public getCurrentUser(): string | null {
    return sessionStorage.getItem(this.USER_KEY);
  }

  public storeCurrentUser(user: User): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  public removeUserSession(): void {
    sessionStorage.clear();
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  public storeUserSession(accessToken: string, user: User, refreshToken: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  public storeAccessToken(token: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  public getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);;
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
}
