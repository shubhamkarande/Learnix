import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, EnrollmentService } from '../../../core/services';
import { Enrollment } from '../../../core/models';
import { ProgressBarComponent } from '../../../shared/components';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ProgressBarComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Welcome back, {{ getUserFirstName() }}! 👋
        </h1>
        <p class="text-gray-600 mt-2">Continue your learning journey</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ enrollments().length }}</p>
              <p class="text-gray-500">Enrolled Courses</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ completedCount() }}</p>
              <p class="text-gray-500">Completed</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138c.179.713.569 1.36 1.105 1.846.536.486.947 1.1 1.2 1.795a3.42 3.42 0 01-1.796 4.134"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ certificatesCount() }}</p>
              <p class="text-gray-500">Certificates</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Continue Learning -->
      @if (inProgress().length > 0) {
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Continue Learning</h2>
            <a routerLink="/dashboard/courses" class="text-primary-600 hover:text-primary-700 font-medium">
              View All
            </a>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (enrollment of inProgress().slice(0, 3); track enrollment.id) {
              <div class="card p-4 hover:shadow-lg transition-shadow">
                <div class="flex gap-4">
                  <div class="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    @if (enrollment.courseThumbnailUrl) {
                      <img [src]="enrollment.courseThumbnailUrl" [alt]="enrollment.courseTitle"
                        class="w-full h-full object-cover">
                    } @else {
                      <div class="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400"></div>
                    }
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-gray-900 truncate">{{ enrollment.courseTitle }}</h3>
                    <p class="text-sm text-gray-500">{{ enrollment.instructorName }}</p>
                    <div class="mt-2">
                      <app-progress-bar [progress]="enrollment.progressPercentage" size="sm" />
                    </div>
                  </div>
                </div>
                <a [routerLink]="['/learn', enrollment.courseId, 'lesson', enrollment.nextLessonId]"
                  class="btn-primary w-full py-2 mt-4 text-sm">
                  Continue
                </a>
              </div>
            }
          </div>
        </div>
      }

      <!-- Completed Courses -->
      @if (completed().length > 0) {
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Completed Courses</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (enrollment of completed().slice(0, 3); track enrollment.id) {
              <div class="card p-4">
                <div class="flex gap-4">
                  <div class="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                    @if (enrollment.courseThumbnailUrl) {
                      <img [src]="enrollment.courseThumbnailUrl" [alt]="enrollment.courseTitle"
                        class="w-full h-full object-cover">
                    } @else {
                      <div class="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400"></div>
                    }
                    <div class="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-gray-900 truncate">{{ enrollment.courseTitle }}</h3>
                    <p class="text-sm text-gray-500">{{ enrollment.instructorName }}</p>
                    <p class="text-xs text-green-600 mt-1">Completed</p>
                  </div>
                </div>
                @if (enrollment.certificateUrl) {
                  <a [href]="enrollment.certificateUrl" target="_blank" 
                    class="btn-secondary w-full py-2 mt-4 text-sm">
                    View Certificate
                  </a>
                }
              </div>
            }
          </div>
        </div>
      }

      <!-- Empty State -->
      @if (!loading() && enrollments().length === 0) {
        <div class="text-center py-16">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
          <p class="text-gray-500 mb-6">Start your learning journey by exploring our courses</p>
          <a routerLink="/courses" class="btn-primary">
            Browse Courses
          </a>
        </div>
      }
    </div>
  `
})
export class StudentDashboardComponent implements OnInit {
  authService = inject(AuthService);
  private enrollmentService = inject(EnrollmentService);

  enrollments = signal<Enrollment[]>([]);
  loading = signal(true);

  inProgress = signal<Enrollment[]>([]);
  completed = signal<Enrollment[]>([]);
  completedCount = signal(0);
  certificatesCount = signal(0);

  ngOnInit(): void {
    this.loadEnrollments();
  }

  getUserFirstName(): string {
    const name = this.authService.user()?.name;
    return name ? name.split(' ')[0] : 'Learner';
  }

  private loadEnrollments(): void {
    this.enrollmentService.getMyEnrollments().subscribe({
      next: (enrollments) => {
        this.enrollments.set(enrollments);
        this.inProgress.set(enrollments.filter(e => !e.completed));
        this.completed.set(enrollments.filter(e => e.completed));
        this.completedCount.set(this.completed().length);
        this.certificatesCount.set(enrollments.filter(e => e.certificateUrl).length);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
