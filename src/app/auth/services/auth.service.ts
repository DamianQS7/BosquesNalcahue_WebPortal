import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/user.interface';
import { LoginRequest } from '../interfaces/login-request.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { BrowserStorageService } from '../../shared/services/browser-storage.service';
import { RefreshTokenRequest } from '../interfaces/refresh-token-request.interface';

export interface AuthServiceState {
  currentUser: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export const STORAGE_KEYS = {
  USER: 'currentUser',
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Dependencies
  private http = inject(HttpClient);
  private storageService = inject(BrowserStorageService);

  // Properties
  private readonly _baseUrl: string = `${environment.baseUrl}/identity`

  // state
  private state = signal<AuthServiceState>({
    currentUser: null,
    accessToken: null,
    refreshToken: null
  });

  // Selectors
  public currentUserName  = computed(() => this.state().currentUser?.name ?? '');
  public currentUserEmail = computed(() => this.state().currentUser?.email ?? '');
  public isAuthorized     = computed(() => this.state().currentUser?.isAdmin ?? false);
  public accessToken      = computed(() => this.state().accessToken);
  public refreshToken     = computed(() => this.state().refreshToken);
  public isAuthenticated  = computed(() => this.state().accessToken ? true : false);

  // Effects
  storeSessionEffect = effect(() => {
    if (this.accessToken() && this.currentUserName() && this.refreshToken()) {
      this.storageService.setToSessionStorage(STORAGE_KEYS.USER, JSON.stringify(this.state().currentUser));
      this.storageService.setToSessionStorage(STORAGE_KEYS.ACCESS_TOKEN, this.accessToken()!);
      this.storageService.setToLocalStorage(STORAGE_KEYS.REFRESH_TOKEN, this.refreshToken()!);
    }
  });

  removeSessionEffect = effect(() => {
    if(!this.accessToken() && !this.currentUserName()) {
      this.storageService.removeUserSession(STORAGE_KEYS.REFRESH_TOKEN);
    }
  });

  // Methods
  constructor() {
    this.initializeAuthStateFromSessionStorage();
  }

  closeUserSession(): void {
    this.state.update(() => ({
      currentUser: null,
      accessToken: null,
      refreshToken: null
    }));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const endpoint: string = `${this._baseUrl}/login`;
    const body: LoginRequest = {email, password};
    console.log('isAuthenticated Signal ->', this.isAuthenticated());
    
    return this.http.post<AuthResponse>(endpoint, body)
      .pipe(
        tap((response) => this.createUserSession(response.userInfo, response.accessToken, response.refreshToken)),
        catchError((error) => throwError(() => error.message))
      )  
  }

  refresh(): Observable<AuthResponse> {
    const endpoint: string = `${this._baseUrl}/refresh`;
    const body: RefreshTokenRequest = { accessToken: this.accessToken()!, refreshToken: this.refreshToken()!};

    return this.http.post<AuthResponse>(endpoint, body)
    .pipe(
      tap((response) => this.state.update(state => ({...state, accessToken: response.accessToken}))),
      catchError((error) => throwError(() => error.message))
    ) 
  }

  private createUserSession(user: User, accessToken: string, refreshToken: string): void {
    this.state.update(() => ({ currentUser: user, accessToken, refreshToken }));
  }

  private initializeAuthStateFromSessionStorage(): void {
    const storedUser = this.storageService.getFromSessionStorage(STORAGE_KEYS.USER);
    const storedToken = this.storageService.getFromSessionStorage(STORAGE_KEYS.ACCESS_TOKEN);
    const storedRefreshToken = this.storageService.getFromLocalStorage(STORAGE_KEYS.REFRESH_TOKEN);

    this.state.update(() => ({
      currentUser: storedUser ? JSON.parse(storedUser) : null,
      accessToken: storedToken ?? null,
      refreshToken: storedRefreshToken ?? null
    }));
  }
}
