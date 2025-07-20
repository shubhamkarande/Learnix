import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, AuthUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'learnix_token';

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token && this.isValidToken(token)) {
      const userData = this.decodeToken(token);
      this.currentUserSubject.next(userData);
    }
  }

  login(credentials: AuthUser): Observable<{ success: boolean; message: string; user?: User }> {
    return new Observable(observer => {
      // Mock authentication logic
      setTimeout(() => {
        if (credentials.email === 'demo@learnix.com' && credentials.password === 'password') {
          const user: User = {
            id: '1',
            name: 'Demo User',
            email: credentials.email,
            avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
            joinedDate: new Date('2024-01-15'),
            enrolledCourses: ['1', '2', '3'],
            completedCourses: ['1'],
            totalLearningHours: 45,
            certificates: []
          };
          
          const token = this.generateMockToken(user);
          localStorage.setItem(this.tokenKey, token);
          this.currentUserSubject.next(user);
          
          observer.next({ success: true, message: 'Login successful', user });
        } else {
          observer.next({ success: false, message: 'Invalid credentials' });
        }
        observer.complete();
      }, 1000);
    });
  }

  signup(userData: AuthUser): Observable<{ success: boolean; message: string; user?: User }> {
    return new Observable(observer => {
      setTimeout(() => {
        const user: User = {
          id: Date.now().toString(),
          name: userData.name || 'New User',
          email: userData.email,
          avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150',
          joinedDate: new Date(),
          enrolledCourses: [],
          completedCourses: [],
          totalLearningHours: 0,
          certificates: []
        };
        
        const token = this.generateMockToken(user);
        localStorage.setItem(this.tokenKey, token);
        this.currentUserSubject.next(user);
        
        observer.next({ success: true, message: 'Account created successfully', user });
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return token ? this.isValidToken(token) : false;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private generateMockToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };
    return btoa(JSON.stringify(payload));
  }

  private decodeToken(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token));
      return {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
        joinedDate: new Date('2024-01-15'),
        enrolledCourses: ['1', '2', '3'],
        completedCourses: ['1'],
        totalLearningHours: 45,
        certificates: []
      };
    } catch {
      return null;
    }
  }

  private isValidToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token));
      return payload.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }
}