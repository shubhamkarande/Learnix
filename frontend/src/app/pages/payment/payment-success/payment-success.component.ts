import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-payment-success',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-[60vh] flex items-center justify-center">
      <div class="text-center max-w-md">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p class="text-gray-600 mb-6">
          Thank you for your purchase. You now have full access to the course.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/dashboard" class="btn-primary">
            Go to Dashboard
          </a>
          <a routerLink="/courses" class="btn-secondary">
            Browse More Courses
          </a>
        </div>
      </div>
    </div>
  `
})
export class PaymentSuccessComponent { }
