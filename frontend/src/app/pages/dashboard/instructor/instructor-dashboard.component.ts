import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, CourseService } from '../../../core/services';
import { Course } from '../../../core/models';

@Component({
    selector: 'app-instructor-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p class="text-gray-600 mt-2">Manage your courses and track your students</p>
        </div>
        <a routerLink="/instructor/courses/new" class="btn-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Create Course
        </a>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ courses().length }}</p>
              <p class="text-gray-500">Total Courses</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ totalStudents() }}</p>
              <p class="text-gray-500">Total Students</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ averageRating().toFixed(1) }}</p>
              <p class="text-gray-500">Avg Rating</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">\$0</p>
              <p class="text-gray-500">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Courses List -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Your Courses</h2>
        
        @if (loading()) {
          <div class="space-y-4">
            @for (i of [1,2,3]; track i) {
              <div class="card p-4 animate-pulse">
                <div class="flex gap-4">
                  <div class="w-32 h-20 bg-gray-200 rounded-lg"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (courses().length === 0) {
          <div class="text-center py-12 card">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
            <p class="text-gray-500 mb-4">Create your first course and start teaching</p>
            <a routerLink="/instructor/courses/new" class="btn-primary">
              Create Your First Course
            </a>
          </div>
        } @else {
          <div class="space-y-4">
            @for (course of courses(); track course.id) {
              <div class="card p-4 hover:shadow-lg transition-shadow">
                <div class="flex gap-4">
                  <!-- Thumbnail -->
                  <div class="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    @if (course.thumbnailUrl) {
                      <img [src]="course.thumbnailUrl" [alt]="course.title"
                        class="w-full h-full object-cover">
                    } @else {
                      <div class="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400"></div>
                    }
                  </div>

                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between">
                      <div>
                        <h3 class="font-medium text-gray-900">{{ course.title }}</h3>
                        <p class="text-sm text-gray-500 mt-1">
                          {{ course.totalLessons }} lessons • {{ course.totalEnrollments }} students
                        </p>
                      </div>
                      <span class="px-2 py-1 text-xs font-medium rounded-full"
                        [class]="course.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                        {{ course.published ? 'Published' : 'Draft' }}
                      </span>
                    </div>
                    
                    <div class="flex items-center gap-4 mt-3">
                      @if (course.averageRating > 0) {
                        <div class="flex items-center gap-1 text-sm text-gray-500">
                          <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          {{ course.averageRating.toFixed(1) }}
                        </div>
                      }
                      <span class="text-sm font-medium text-primary-600">\${{ course.price.toFixed(2) }}</span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-2">
                    <a [routerLink]="['/instructor/courses', course.id, 'edit']"
                      class="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </a>
                    <a [routerLink]="['/courses', course.id]" target="_blank"
                      class="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class InstructorDashboardComponent implements OnInit {
    authService = inject(AuthService);
    private courseService = inject(CourseService);

    courses = signal<Course[]>([]);
    loading = signal(true);

    totalStudents = signal(0);
    averageRating = signal(0);

    ngOnInit(): void {
        this.loadCourses();
    }

    private loadCourses(): void {
        this.courseService.getInstructorCourses().subscribe({
            next: (courses) => {
                this.courses.set(courses);

                // Calculate stats
                const students = courses.reduce((sum, c) => sum + c.totalEnrollments, 0);
                this.totalStudents.set(students);

                const ratings = courses.filter(c => c.averageRating > 0);
                if (ratings.length > 0) {
                    const avgRating = ratings.reduce((sum, c) => sum + c.averageRating, 0) / ratings.length;
                    this.averageRating.set(avgRating);
                }

                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }
}
