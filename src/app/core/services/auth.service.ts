import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AUTH_API_URL } from './api-config';
import { AuthResponse, LoginRequest, RegisterRequest, SessionUser } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'hms-user';
  readonly currentUser = signal<SessionUser | null>(this.loadUser());

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${AUTH_API_URL}/auth/login`, payload).pipe(
      tap(response => {
        const session: SessionUser = { token: response.token, email: response.email, role: response.role };
        localStorage.setItem(this.storageKey, JSON.stringify(session));
        sessionStorage.setItem(this.storageKey, JSON.stringify(session));
        this.currentUser.set(session);
      })
    );
  }

  register(payload: RegisterRequest): Observable<string> {
    return this.http.post(`${AUTH_API_URL}/auth/register`, payload, { responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.storageKey);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return this.currentUser()?.token ?? null;
  }

  private loadUser(): SessionUser | null {
    const raw = sessionStorage.getItem(this.storageKey) ?? localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) as SessionUser : null;
  }
}
