import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = environment.apiUrl;
    private readonly TOKEN_KEY = 'learnix_token';

    // Signals for reactive state
    private userSignal = signal<User | null>(null);
    private loadingSignal = signal<boolean>(false);

    // Public computed signals
    readonly user = this.userSignal.asReadonly();
    readonly isAuthenticated = computed(() => !!this.userSignal());
    readonly isLoading = this.loadingSignal.asReadonly();
    readonly isStudent = computed(() => this.userSignal()?.role === 'STUDENT');
    readonly isInstructor = computed(() => this.userSignal()?.role === 'INSTRUCTOR');
    readonly isAdmin = computed(() => this.userSignal()?.role === 'ADMIN');

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.initializeAuth();
    }

    private initializeAuth(): void {
        const token = this.getToken();
        if (token) {
            this.loadCurrentUser();
        }
    }

    register(request: RegisterRequest): Observable<AuthResponse> {
        this.loadingSignal.set(true);
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, request).pipe(
            tap(response => {
                this.handleAuthSuccess(response);
            }),
            catchError(error => {
                this.loadingSignal.set(false);
                return throwError(() => error);
            })
        );
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        this.loadingSignal.set(true);
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, request).pipe(
            tap(response => {
                this.handleAuthSuccess(response);
            }),
            catchError(error => {
                this.loadingSignal.set(false);
                return throwError(() => error);
            })
        );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        this.userSignal.set(null);
        this.router.navigate(['/']);
    }

    loadCurrentUser(): void {
        const token = this.getToken();
        if (!token) return;

        this.loadingSignal.set(true);
        this.http.get<AuthResponse>(`${this.apiUrl}/auth/me`).subscribe({
            next: (response) => {
                this.userSignal.set(response.user);
                this.loadingSignal.set(false);
            },
            error: () => {
                this.logout();
                this.loadingSignal.set(false);
            }
        });
    }

    updateProfile(data: Partial<User>): Observable<AuthResponse> {
        const params = new URLSearchParams();
        if (data.name) params.append('name', data.name);
        if (data.bio) params.append('bio', data.bio);
        if (data.headline) params.append('headline', data.headline);
        if (data.avatarUrl) params.append('avatarUrl', data.avatarUrl);

        return this.http.put<AuthResponse>(`${this.apiUrl}/auth/profile?${params.toString()}`, {}).pipe(
            tap(response => {
                this.userSignal.set(response.user);
            })
        );
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    private handleAuthSuccess(response: AuthResponse): void {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        this.userSignal.set(response.user);
        this.loadingSignal.set(false);

        // Navigate based on role
        const role = response.user.role;
        if (role === 'ADMIN') {
            this.router.navigate(['/admin']);
        } else if (role === 'INSTRUCTOR') {
            this.router.navigate(['/instructor']);
        } else {
            this.router.navigate(['/dashboard']);
        }
    }
}
