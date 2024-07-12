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
  public isAuthenticated = computed(() => 
    typeof this.accessToken === 'string' ? true : false);

  // Methods
  public login(email: string, password: string): Observable<boolean> {
    const endpoint: string = `${this.baseUrl}/login`;
    const body: LoginRequest = {email, password};
    
    return this.http.post<AuthResponse>(endpoint, body)
      .pipe(
        map((response) => response.success 
                        ? this.createUserSession(response.userInfo, response.token) 
                        : false),
        catchError((error) => throwError(() => error.message))
      )  
  }

  private createUserSession(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._accessToken.set(token);
    return true
  }
}
