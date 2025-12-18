import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="glass fixed top-0 left-0 right-0 z-50 dark:bg-gray-900/80 dark:border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <span class="text-xl font-bold gradient-text">Learnix</span>
          </a>

          <!-- Auth Section -->
          <div class="flex items-center gap-3">
            <!-- Dark Mode Toggle -->
            <button (click)="toggleDarkMode()" 
              class="p-2 rounded-lg text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-800 transition-colors">
              @if (isDarkMode()) {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              } @else {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              }
            </button>

            @if (authService.isAuthenticated()) {
              <!-- Search -->
              <button class="p-2 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>

              <!-- User Menu -->
              <div class="relative group">
                <button class="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  @if (authService.user()?.avatarUrl) {
                    <img [src]="authService.user()?.avatarUrl" [alt]="authService.user()?.name"
                      class="w-8 h-8 rounded-full object-cover">
                  } @else {
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 
                      flex items-center justify-center text-white font-semibold text-sm">
                      {{ authService.user()?.name?.charAt(0)?.toUpperCase() }}
                    </div>
                  }
                </button>

                <!-- Dropdown -->
                <div class="invisible group-hover:visible opacity-0 group-hover:opacity-100 
                  absolute right-0 mt-2 w-56 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700
                  transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                  <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p class="font-semibold text-gray-900 dark:text-white">{{ authService.user()?.name }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ authService.user()?.email }}</p>
                  </div>
                  
                  <a [routerLink]="getDashboardLink()" 
                    class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Dashboard
                  </a>
                  <a routerLink="/profile" 
                    class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Profile Settings
                  </a>
                  
                  <div class="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                    <button (click)="authService.logout()" 
                      class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            } @else {
              <a routerLink="/auth/login" class="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors">
                Sign In
              </a>
              <a routerLink="/auth/register" class="btn-primary text-sm py-2 px-4">
                Get Started
              </a>
            }
          </div>
        </div>
      </div>
    </nav>

    <!-- Spacer for fixed navbar -->
    <div class="h-16"></div>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  isDarkMode = signal(false);

  constructor() {
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkMode.set(savedTheme === 'dark' || (!savedTheme && prefersDark));
    this.applyTheme();
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(v => !v);
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
  }

  private applyTheme(): void {
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  getDashboardLink(): string {
    const role = this.authService.user()?.role;
    if (role === 'ADMIN') return '/admin';
    if (role === 'INSTRUCTOR') return '/instructor';
    return '/dashboard';
  }
}

