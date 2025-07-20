import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">L</span>
              </div>
              <span class="font-bold text-xl text-gray-900">Learnix</span>
            </a>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <a routerLink="/courses" routerLinkActive="text-primary-600" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">Courses</a>
            <a routerLink="/about" routerLinkActive="text-primary-600" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">About</a>
            <a routerLink="/contact" routerLinkActive="text-primary-600" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">Contact</a>
          </div>

          <!-- Auth Actions -->
          <div class="flex items-center space-x-4">
            <div *ngIf="!currentUser; else userMenu" class="flex items-center space-x-3">
              <a routerLink="/login" class="btn-ghost">Login</a>
              <a routerLink="/signup" class="btn-primary">Sign Up</a>
            </div>
            
            <ng-template #userMenu>
              <div class="relative" #dropdown>
                <button (click)="toggleDropdown()" class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <img [src]="currentUser?.avatar" [alt]="currentUser?.name" class="w-8 h-8 rounded-full object-cover">
                  <span class="hidden md:block font-medium text-gray-700">{{currentUser?.name}}</span>
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <div *ngIf="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <a routerLink="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
                  <a routerLink="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                  <hr class="my-1 border-gray-200">
                  <button (click)="logout()" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
              </div>
            </ng-template>

            <!-- Mobile menu button -->
            <button (click)="toggleMobileMenu()" class="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div *ngIf="isMobileMenuOpen" class="md:hidden border-t border-gray-200 py-4">
          <div class="flex flex-col space-y-3">
            <a routerLink="/courses" class="text-gray-700 hover:text-primary-600 font-medium py-2">Courses</a>
            <a routerLink="/about" class="text-gray-700 hover:text-primary-600 font-medium py-2">About</a>
            <a routerLink="/contact" class="text-gray-700 hover:text-primary-600 font-medium py-2">Contact</a>
            <div *ngIf="!currentUser" class="flex flex-col space-y-2 pt-3 border-t border-gray-200">
              <a routerLink="/login" class="btn-ghost">Login</a>
              <a routerLink="/signup" class="btn-primary">Sign Up</a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.isDropdownOpen = false;
  }
}