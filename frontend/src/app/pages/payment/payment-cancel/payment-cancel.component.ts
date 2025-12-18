import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-payment-cancel',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-[60vh] flex items-center justify-center">
      <div class="text-center max-w-md">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-100 flex items-center justify-center">
          <svg class="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p class="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/courses" class="btn-primary">
            Browse Courses
          </a>
          <a routerLink="/" class="btn-secondary">
            Go Home
          </a>
        </div>
      </div>
    </div>
  `
})
export class PaymentCancelComponent { }
