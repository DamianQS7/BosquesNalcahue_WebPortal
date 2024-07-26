import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { User } from '../interfaces/user.interface';
import { LoginRequest } from '../interfaces/login-request.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { BrowserStorageService } from '../../services/browser-storage.service';
import { RefreshTokenRequest } from '../interfaces/refresh-token-request.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Dependencies
  private _http: HttpClient = inject(HttpClient);
  private _storage: BrowserStorageService = inject(BrowserStorageService);

  // Properties
  private _baseUrl: string = `${environment.baseUrl}/identity`
  private _currentUser = signal<User | null>(null);
  private _accessToken = signal<string | null>(null);
  private _refreshToken = signal<string | null>(null);

  public currentUser     = computed(() => this._currentUser());
  public accessToken     = computed(() => this._accessToken());
  public refreshToken    = computed(() => this._refreshToken());
  public isAuthenticated = computed(() => this._accessToken() ? true : false);

  // Methods
  constructor() {
    this.initializeAuthStateFromSessionStorage();

    effect(() => {

      if (this._accessToken() && this._currentUser() && this._refreshToken()) {
        console.log('Storing session data from effect')
        this._storage.storeUserSession(
          this._accessToken()!, 
          this._currentUser()!, 
          this._refreshToken()!
        )
      }
      
      if(!this._accessToken() && !this._currentUser()) {
        console.log('Removing session data from effect')
        this._storage.removeUserSession();
      }
    });
  }

  public closeUserSession(): void {
    this._currentUser.set(null);
    this._accessToken.set(null);
    this._refreshToken.set(null);
  }

  public login(email: string, password: string): Observable<AuthResponse> {
    const endpoint: string = `${this._baseUrl}/login`;
    const body: LoginRequest = {email, password};
    console.log('isAuthenticated Signal ->', this.isAuthenticated());
    
    return this._http.post<AuthResponse>(endpoint, body)
      .pipe(
        tap((response) => this.createUserSession(response.userInfo, response.accessToken, response.refreshToken)),
        catchError((error) => throwError(() => error.message))
      )  
  }

  public refresh(): Observable<AuthResponse> {
    const endpoint: string = `${this._baseUrl}/refresh`;
    const body: RefreshTokenRequest = { accessToken: this.accessToken()!, refreshToken: this.refreshToken()!};

    return this._http.post<AuthResponse>(endpoint, body)
    .pipe(
      tap((response) => this._accessToken.set(response.accessToken)),
      catchError((error) => throwError(() => error.message))
    ) 
  }

  private createUserSession(user: User, accessToken: string, refreshToken: string): void {
    this._currentUser.set(user);
    this._accessToken.set(accessToken);
    this._refreshToken.set(refreshToken);
  }

  private initializeAuthStateFromSessionStorage(): void {
    const storedUser = this._storage.getCurrentUser();
    const storedToken = this._storage.getAccessToken();
    const storedRefreshToken = this._storage.getRefreshToken();

    this._currentUser.set(storedUser ? JSON.parse(storedUser) : null);
    this._accessToken.set(storedToken ? storedToken : null);
    this._refreshToken.set(storedRefreshToken ? storedRefreshToken : null);
  
  }
}
