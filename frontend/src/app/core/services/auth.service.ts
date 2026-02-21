import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../config/api.config';
import { JwtResponse, LoginRequest, SignupRequest, MessageResponse } from '../models/auth.models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = `${environment.apiBaseUrl}/api/auth`;
    private readonly TOKEN_KEY = 'paymate_token';
    private readonly USER_KEY = 'paymate_user';

    private currentUserSubject = new BehaviorSubject<JwtResponse | null>(this.getStoredUser());
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) { }

    login(credentials: LoginRequest): Observable<JwtResponse> {
        return this.http.post<JwtResponse>(`${this.API_URL}/signin`, credentials).pipe(
            tap(response => {
                localStorage.setItem(this.TOKEN_KEY, response.token);
                localStorage.setItem(this.USER_KEY, JSON.stringify(response));
                this.currentUserSubject.next(response);
            })
        );
    }

    signup(request: SignupRequest): Observable<MessageResponse> {
        return this.http.post<MessageResponse>(`${this.API_URL}/signup`, request);
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        return !!token;
    }

    getCurrentUser(): JwtResponse | null {
        return this.currentUserSubject.value;
    }

    private getStoredUser(): JwtResponse | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        if (userStr) {
            try {
                return JSON.parse(userStr) as JwtResponse;
            } catch {
                return null;
            }
        }
        return null;
    }
}
