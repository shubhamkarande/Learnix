import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center">
          <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">L</span>
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">Create your account</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <a routerLink="/login" class="font-medium text-primary-600 hover:text-primary-500 ml-1">
            sign in to your existing account
          </a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Full name</label>
              <div class="mt-1">
                <input
                  id="name"
                  type="text"
                  formControlName="name"
                  required
                  class="input-field"
                  [class.border-red-500]="signupForm.get('name')?.invalid && signupForm.get('name')?.touched"
                >
              </div>
              <div *ngIf="signupForm.get('name')?.invalid && signupForm.get('name')?.touched" class="mt-1 text-sm text-red-600">
                <div *ngIf="signupForm.get('name')?.errors?.['required']">Full name is required</div>
                <div *ngIf="signupForm.get('name')?.errors?.['minlength']">Name must be at least 2 characters</div>
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
              <div class="mt-1">
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  required
                  class="input-field"
                  [class.border-red-500]="signupForm.get('email')?.invalid && signupForm.get('email')?.touched"
                >
              </div>
              <div *ngIf="signupForm.get('email')?.invalid && signupForm.get('email')?.touched" class="mt-1 text-sm text-red-600">
                <div *ngIf="signupForm.get('email')?.errors?.['required']">Email is required</div>
                <div *ngIf="signupForm.get('email')?.errors?.['email']">Please enter a valid email</div>
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <div class="mt-1">
                <input
                  id="password"
                  type="password"
                  formControlName="password"
                  required
                  class="input-field"
                  [class.border-red-500]="signupForm.get('password')?.invalid && signupForm.get('password')?.touched"
                >
              </div>
              <div *ngIf="signupForm.get('password')?.invalid && signupForm.get('password')?.touched" class="mt-1 text-sm text-red-600">
                <div *ngIf="signupForm.get('password')?.errors?.['required']">Password is required</div>
                <div *ngIf="signupForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</div>
              </div>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm password</label>
              <div class="mt-1">
                <input
                  id="confirmPassword"
                  type="password"
                  formControlName="confirmPassword"
                  required
                  class="input-field"
                  [class.border-red-500]="signupForm.get('confirmPassword')?.invalid && signupForm.get('confirmPassword')?.touched"
                >
              </div>
              <div *ngIf="signupForm.get('confirmPassword')?.invalid && signupForm.get('confirmPassword')?.touched" class="mt-1 text-sm text-red-600">
                <div *ngIf="signupForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</div>
                <div *ngIf="signupForm.get('confirmPassword')?.errors?.['passwordMismatch']">Passwords do not match</div>
              </div>
            </div>

            <div class="flex items-center">
              <input id="terms" type="checkbox" formControlName="agreeToTerms" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
              <label for="terms" class="ml-2 block text-sm text-gray-900">
                I agree to the
                <a href="#" class="text-primary-600 hover:text-primary-500">Terms and Conditions</a>
                and
                <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
              </label>
            </div>
            <div *ngIf="signupForm.get('agreeToTerms')?.invalid && signupForm.get('agreeToTerms')?.touched" class="text-sm text-red-600">
              You must agree to the terms and conditions
            </div>

            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {{errorMessage}}
            </div>

            <div *ngIf="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {{successMessage}}
            </div>

            <div>
              <button
                type="submit"
                [disabled]="signupForm.invalid || loading"
                class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="loading" class="inline-flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
                <span *ngIf="!loading">Create account</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      agreeToTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { confirmPassword, agreeToTerms, ...userData } = this.signupForm.value;

      this.authService.signup(userData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = response.message;
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1000);
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'An error occurred. Please try again.';
        }
      });
    }
  }
}