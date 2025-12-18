import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 dark:bg-gray-950">
      <div class="max-w-md w-full">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Your Account</h1>
          <p class="text-gray-600 dark:text-gray-400">Start your learning journey today</p>
        </div>

        <!-- Form Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <!-- Name -->
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                formControlName="name"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              >
              @if (form.get('name')?.touched && form.get('name')?.invalid) {
                <p class="mt-1 text-sm text-red-500">Name must be at least 2 characters</p>
              }
            </div>

            <!-- Email -->
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              >
              @if (form.get('email')?.touched && form.get('email')?.invalid) {
                <p class="mt-1 text-sm text-red-500">Please enter a valid email address</p>
              }
            </div>

            <!-- Password -->
            <div class="mb-4">
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="At least 6 characters"
              >
              @if (form.get('password')?.touched && form.get('password')?.invalid) {
                <p class="mt-1 text-sm text-red-500">Password must be at least 6 characters</p>
              }
            </div>

            <!-- Role Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                I want to...
              </label>
              <div class="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  (click)="selectRole('STUDENT')"
                  class="p-4 border-2 rounded-xl text-center transition-all"
                  [class]="form.get('role')?.value === 'STUDENT' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'"
                >
                  <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                  <span class="font-medium">Learn</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Take courses</p>
                </button>
                <button
                  type="button"
                  (click)="selectRole('INSTRUCTOR')"
                  class="p-4 border-2 rounded-xl text-center transition-all"
                  [class]="form.get('role')?.value === 'INSTRUCTOR' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'"
                >
                  <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  <span class="font-medium">Teach</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Create courses</p>
                </button>
              </div>
            </div>

            <!-- Error Message -->
            @if (error()) {
              <div class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {{ error() }}
              </div>
            }

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="form.invalid || loading()"
              class="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (loading()) {
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              } @else {
                Create Account
              }
            </button>

            <!-- Terms -->
            <p class="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              By signing up, you agree to our
              <a href="#" class="text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</a>
              and
              <a href="#" class="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>
            </p>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or</span>
            </div>
          </div>

          <!-- Login Link -->
          <p class="text-center text-gray-600 dark:text-gray-400">
            Already have an account?
            <a routerLink="/auth/login" class="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['STUDENT', Validators.required]
  });

  loading = signal(false);
  error = signal<string | null>(null);

  selectRole(role: 'STUDENT' | 'INSTRUCTOR'): void {
    this.form.patchValue({ role });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Registration failed. Please try again.');
      }
    });
  }
}
