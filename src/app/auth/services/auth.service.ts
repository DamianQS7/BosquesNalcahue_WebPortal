import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { User } from '../interfaces/user.interface';
import { LoginRequest } from '../interfaces/login-request.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Dependencies
  private http: HttpClient = inject(HttpClient);

  // Properties
  private baseUrl: string = `${environment.baseUrl}/identity`
  private _currentUser = signal<User | null | undefined>(undefined);
  private _accessToken = signal<string | null | undefined>(undefined);

  public currentUser     = computed(() => this._currentUser());
  public accessToken     = computed(() => this._accessToken());
  public isAuthenticated = computed(() => this._accessToken() ? true : false);

  // Methods
  public login(email: string, password: string): Observable<AuthResponse> {
    const endpoint: string = `${this.baseUrl}/login`;
    const body: LoginRequest = {email, password};
    console.log('isAuthenticated Signal ->', this.isAuthenticated());
    
    return this.http.post<AuthResponse>(endpoint, body)
      .pipe(
        tap((response) => this.createUserSession(response.userInfo, response.token)),
        catchError((error) => throwError(() => error.message))
      )  
  }

  public closeUserSession(): void {
    this._currentUser.set(null);
    this._accessToken.set(null);
  }

  private createUserSession(user: User, token: string): void {
    this._currentUser.set(user);
    this._accessToken.set(token);
  }
}
