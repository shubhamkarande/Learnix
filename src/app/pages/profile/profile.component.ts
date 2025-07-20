import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="currentUser" class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 class="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p class="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Profile Overview -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="text-center">
                <img [src]="currentUser.avatar" [alt]="currentUser.name" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover">
                <h3 class="text-lg font-semibold text-gray-900">{{currentUser.name}}</h3>
                <p class="text-gray-600">{{currentUser.email}}</p>
                <p class="text-sm text-gray-500 mt-2">Member since {{currentUser.joinedDate | date:'MMMM yyyy'}}</p>
              </div>
              
              <div class="mt-6 space-y-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">Courses Enrolled</span>
                  <span class="font-semibold">{{currentUser.enrolledCourses.length}}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Courses Completed</span>
                  <span class="font-semibold">{{currentUser.completedCourses.length}}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Learning Hours</span>
                  <span class="font-semibold">{{currentUser.totalLearningHours}}h</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Certificates</span>
                  <span class="font-semibold">{{currentUser.certificates.length}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Settings -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Personal Information -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              <div class="p-6">
                <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        id="name"
                        type="text"
                        formControlName="name"
                        class="input-field"
                      >
                    </div>
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        formControlName="email"
                        class="input-field"
                      >
                    </div>
                  </div>
                  
                  <div *ngIf="updateMessage" 
                       [class.text-green-600]="updateSuccess"
                       [class.text-red-600]="!updateSuccess"
                       class="text-sm">
                    {{updateMessage}}
                  </div>
                  
                  <div class="flex justify-end">
                    <button 
                      type="submit" 
                      [disabled]="profileForm.invalid || updating"
                      class="btn-primary disabled:opacity-50"
                    >
                      <span *ngIf="updating">Updating...</span>
                      <span *ngIf="!updating">Update Profile</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Learning History -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Learning History</h3>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                      <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-900">Complete Web Development Bootcamp</h4>
                        <p class="text-sm text-gray-600">Completed on January 15, 2024</p>
                      </div>
                    </div>
                    <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Completed</span>
                  </div>
                  
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                      <div class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-900">Data Science with Python</h4>
                        <p class="text-sm text-gray-600">In progress - 45% complete</p>
                      </div>
                    </div>
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">In Progress</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Certificates -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Certificates</h3>
              </div>
              <div class="p-6">
                <div class="text-center py-8">
                  <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
                  <p class="text-gray-500">Complete courses to earn certificates</p>
                </div>
              </div>
            </div>

            <!-- Payment History -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Payment History</h3>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 class="font-medium text-gray-900">Complete Web Development Bootcamp</h4>
                      <p class="text-sm text-gray-600">January 1, 2024</p>
                    </div>
                    <div class="text-right">
                      <div class="font-semibold text-gray-900">\$89.99</div>
                      <div class="text-sm text-green-600">Paid</div>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 class="font-medium text-gray-900">Data Science with Python</h4>
                      <p class="text-sm text-gray-600">January 10, 2024</p>
                    </div>
                    <div class="text-right">
                      <div class="font-semibold text-gray-900">\$79.99</div>
                      <div class="text-sm text-green-600">Paid</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  updating = false;
  updateMessage = '';
  updateSuccess = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        });
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.updating = true;
      this.updateMessage = '';

      // Mock update logic
      setTimeout(() => {
        this.updating = false;
        this.updateSuccess = true;
        this.updateMessage = 'Profile updated successfully!';
        
        setTimeout(() => {
          this.updateMessage = '';
        }, 3000);
      }, 1000);
    }
  }
}