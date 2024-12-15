import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, map, merge, Observable, Subject, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { connect } from 'ngxtension/connect';
import { BrowserStorageService } from '../../shared/services/browser-storage.service';
import { AuthResponse, LoginRequest, User } from '../interfaces';

export type LoginStatus = 'pending' | 'authenticating' | 'authenticated' | 'error';

export interface AuthServiceState {
  currentUser: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: LoginStatus;
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
  private readonly _baseUrl: string = `${environment.baseUrl}/identity`;
  private readonly loginEndpoint: string  = `${this._baseUrl}/login`; 
  private readonly refreshEndpoint: string  = `${this._baseUrl}/refresh`;

  // state
  private state = signal<AuthServiceState>({
    currentUser: null,
    accessToken: null,
    refreshToken: null,
    status: 'pending'
  });

  // Selectors
  currentUser  = computed(() => this.state().currentUser);
  accessToken  = computed(() => this.state().accessToken);
  refreshToken = computed(() => this.state().refreshToken);
  status       = computed(() => this.state().status);
  isAuthorized = computed(() => this.state().currentUser?.isAdmin ?? false);
  
  // Sources
  error$  = new Subject<any>();
  private logout$ = new Subject<void>();
  private loginCredentials$ = new Subject<LoginRequest>();
  private loginRequest$  = this.loginCredentials$.pipe(
    switchMap(credentials => 
      this.http.post<AuthResponse>(this.loginEndpoint, credentials).pipe(
        catchError(error => {
          this.error$.next(error);
          return EMPTY;
        })
      )
    )
  );
  private refresh$ = this.http
    .post<AuthResponse>(this.refreshEndpoint, {accessToken: this.accessToken()!, refreshToken: this.refreshToken()!})
    .pipe(
      tap((response) => this.state.update(() => ({
        currentUser: response.userInfo,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        status: 'authenticated' as const
      })))
    );
  
  
  // Methods
  constructor() {
    this.initializeAuthStateFromSessionStorage();

    // reducers
    const updatedState$ = merge(
      this.loginCredentials$.pipe(map(() => ({status: 'authenticating' as const}))),
      this.error$.pipe(map((error) => ({status: 'error' as const}))),
      this.loginRequest$.pipe(map((response) => ({
        currentUser: response.userInfo,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        status: 'authenticated' as const
      }))),
      this.logout$.pipe(map(() => ({
        currentUser: null,
        accessToken: null,
        refreshToken: null,
        status: 'pending' as const
      }))),
    );

    connect(this.state).with(updatedState$);
  }

  login(credentials: LoginRequest): void {
    this.loginCredentials$.next(credentials);
  }

  logout(): void {
    this.logout$.next();
  }

  refresh(): Observable<AuthResponse> {
    return this.refresh$;
  }

  // To prevent losing the state when page is refreshed.
  private initializeAuthStateFromSessionStorage(): void {
    const storedUser = this.storageService.getFromSessionStorage(STORAGE_KEYS.USER);
    const storedToken = this.storageService.getFromSessionStorage(STORAGE_KEYS.ACCESS_TOKEN);
    const storedRefreshToken = this.storageService.getFromLocalStorage(STORAGE_KEYS.REFRESH_TOKEN);

    this.state.update(() => ({
      currentUser: storedUser ? JSON.parse(storedUser) : null,
      accessToken: storedToken ?? null,
      refreshToken: storedRefreshToken ?? null,
      status: storedToken ? 'authenticated' as const : 'pending' as const
    }));
  }

  // Effects
  private storeSessionEffect = effect(() => {
    if (this.accessToken() && this.currentUser() && this.refreshToken()) {
      this.storageService.setToSessionStorage(STORAGE_KEYS.USER, JSON.stringify(this.state().currentUser));
      this.storageService.setToSessionStorage(STORAGE_KEYS.ACCESS_TOKEN, this.accessToken()!);
      this.storageService.setToLocalStorage(STORAGE_KEYS.REFRESH_TOKEN, this.refreshToken()!);
    }
  });

  private removeSessionEffect = effect(() => {
    if(!this.accessToken() && !this.currentUser()) {
      this.storageService.removeUserSession(STORAGE_KEYS.REFRESH_TOKEN);
    }
  });
}
