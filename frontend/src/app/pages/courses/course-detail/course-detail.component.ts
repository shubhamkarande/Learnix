import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CourseService, EnrollmentService, PaymentService, AuthService } from '../../../core/services';
import { Course, Lesson } from '../../../core/models';
import { ProgressBarComponent } from '../../../shared/components';

@Component({
    selector: 'app-course-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, ProgressBarComponent],
    template: `
    @if (loading()) {
      <div class="flex items-center justify-center min-h-[60vh]">
        <div class="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    } @else if (course()) {
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <!-- Thumbnail / Video Preview -->
            <div class="video-container mb-6">
              @if (course()!.thumbnailUrl) {
                <img [src]="course()!.thumbnailUrl" [alt]="course()!.title"
                  class="absolute inset-0 w-full h-full object-cover">
              } @else {
                <div class="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500
                  flex items-center justify-center">
                  <svg class="w-24 h-24 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              }
            </div>

            <!-- Title & Meta -->
            <div class="mb-6">
              @if (course()!.category) {
                <span class="inline-block px-3 py-1 text-sm font-medium bg-primary-100 text-primary-700 
                  rounded-full mb-3">
                  {{ course()!.category }}
                </span>
              }
              <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ course()!.title }}</h1>
              
              <div class="flex flex-wrap items-center gap-4 text-gray-600">
                <!-- Rating -->
                @if (course()!.totalRatings > 0) {
                  <div class="flex items-center gap-1">
                    <svg class="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="font-semibold">{{ course()!.averageRating.toFixed(1) }}</span>
                    <span>({{ course()!.totalRatings }} ratings)</span>
                  </div>
                }
                
                <span>{{ course()!.totalEnrollments }} students</span>
                <span>{{ course()!.totalLessons }} lessons</span>
                <span>{{ formatDuration(course()!.totalDurationMinutes) }}</span>
              </div>
            </div>

            <!-- Description -->
            <div class="prose max-w-none mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-3">About This Course</h2>
              <p class="text-gray-600 whitespace-pre-line">{{ course()!.description }}</p>
            </div>

            <!-- Curriculum -->
            <div class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Course Content</h2>
              <div class="space-y-2">
                @for (lesson of allLessons(); track lesson.id; let i = $index) {
                  <div class="flex items-center gap-4 p-4 bg-surface-50 rounded-xl hover:bg-surface-100 
                    transition-colors cursor-pointer"
                    [class.opacity-50]="!lesson.previewable && !course()!.enrolled"
                    (click)="openLesson(lesson)">
                    <!-- Index -->
                    <div class="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center 
                      justify-center font-semibold text-sm">
                      {{ i + 1 }}
                    </div>
                    
                    <!-- Title -->
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900">{{ lesson.title }}</h4>
                      <p class="text-sm text-gray-500">{{ formatSeconds(lesson.durationSeconds) }}</p>
                    </div>
                    
                    <!-- Status -->
                    @if (lesson.completed) {
                      <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    } @else if (lesson.previewable) {
                      <span class="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        Preview
                      </span>
                    } @else {
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    }
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="card p-6 sticky top-20">
              <!-- Price -->
              <div class="text-center mb-6">
                <div class="text-4xl font-bold text-gray-900 mb-2">
                  @if (course()!.price === 0) {
                    Free
                  } @else {
                    \${{ course()!.price.toFixed(2) }}
                  }
                </div>
                @if (course()!.enrolled) {
                  <app-progress-bar [progress]="course()!.progressPercentage || 0" [showLabel]="true" />
                }
              </div>

              <!-- Action Button -->
              @if (course()!.enrolled) {
                <button (click)="continueLearning()" class="btn-primary w-full py-3 mb-4">
                  Continue Learning
                </button>
              } @else if (authService.isAuthenticated()) {
                @if (course()!.price === 0) {
                  <button (click)="enrollFree()" [disabled]="enrolling()" 
                    class="btn-primary w-full py-3 mb-4 disabled:opacity-50">
                    @if (enrolling()) {
                      Enrolling...
                    } @else {
                      Enroll for Free
                    }
                  </button>
                } @else {
                  <button (click)="purchaseCourse()" [disabled]="enrolling()"
                    class="btn-primary w-full py-3 mb-4 disabled:opacity-50">
                    @if (enrolling()) {
                      Processing...
                    } @else {
                      Buy Now
                    }
                  </button>
                }
              } @else {
                <a routerLink="/auth/login" class="btn-primary w-full py-3 mb-4 text-center block">
                  Sign in to Enroll
                </a>
              }

              <!-- Course Info -->
              <div class="border-t border-gray-200 pt-4 space-y-3">
                <div class="flex items-center gap-3 text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ formatDuration(course()!.totalDurationMinutes) }} total</span>
                </div>
                <div class="flex items-center gap-3 text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  <span>{{ course()!.totalLessons }} lessons</span>
                </div>
                @if (course()!.level) {
                  <div class="flex items-center gap-3 text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    <span>{{ course()!.level }} level</span>
                  </div>
                }
                <div class="flex items-center gap-3 text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138c.179.713.569 1.36 1.105 1.846.536.486.947 1.1 1.2 1.795a3.42 3.42 0 01-1.796 4.134"/>
                  </svg>
                  <span>Certificate of completion</span>
                </div>
              </div>

              <!-- Instructor -->
              <div class="border-t border-gray-200 mt-4 pt-4">
                <h4 class="font-medium text-gray-900 mb-3">Instructor</h4>
                <div class="flex items-center gap-3">
                  @if (course()!.instructor.avatarUrl) {
                    <img [src]="course()!.instructor.avatarUrl" [alt]="course()!.instructor.name"
                      class="w-12 h-12 rounded-full object-cover">
                  } @else {
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400
                      flex items-center justify-center text-white font-semibold text-lg">
                      {{ course()!.instructor.name.charAt(0) }}
                    </div>
                  }
                  <div>
                    <p class="font-medium text-gray-900">{{ course()!.instructor.name }}</p>
                    @if (course()!.instructor.headline) {
                      <p class="text-sm text-gray-500">{{ course()!.instructor.headline }}</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="flex flex-col items-center justify-center min-h-[60vh]">
        <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-gray-500 text-lg">Course not found</p>
        <a routerLink="/courses" class="text-primary-600 hover:underline mt-2">Browse all courses</a>
      </div>
    }
  `
})
export class CourseDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private courseService = inject(CourseService);
    private enrollmentService = inject(EnrollmentService);
    private paymentService = inject(PaymentService);
    authService = inject(AuthService);

    course = signal<Course | null>(null);
    loading = signal(true);
    enrolling = signal(false);

    ngOnInit(): void {
        const courseId = this.route.snapshot.paramMap.get('id');
        if (courseId) {
            this.loadCourse(courseId);
        }
    }

    private loadCourse(id: string): void {
        this.courseService.getCourseById(id).subscribe({
            next: (course) => {
                this.course.set(course);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    allLessons(): Lesson[] {
        const course = this.course();
        if (!course) return [];

        // Combine lessons from modules and standalone lessons
        const moduleLessons = course.modules?.flatMap(m => m.lessons) || [];
        const standaloneLessons = course.lessons || [];

        return [...moduleLessons, ...standaloneLessons].sort((a, b) => a.orderIndex - b.orderIndex);
    }

    formatDuration(minutes: number): string {
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
    }

    formatSeconds(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    openLesson(lesson: Lesson): void {
        const course = this.course();
        if (!course) return;

        if (course.enrolled || lesson.previewable) {
            this.router.navigate(['/learn', course.id, 'lesson', lesson.id]);
        }
    }

    continueLearning(): void {
        const course = this.course();
        if (!course) return;

        const lessons = this.allLessons();
        const nextLesson = lessons.find(l => !l.completed) || lessons[0];

        if (nextLesson) {
            this.router.navigate(['/learn', course.id, 'lesson', nextLesson.id]);
        }
    }

    enrollFree(): void {
        const course = this.course();
        if (!course) return;

        this.enrolling.set(true);
        this.enrollmentService.enrollInCourse(course.id).subscribe({
            next: () => {
                this.enrolling.set(false);
                this.loadCourse(course.id); // Reload to update enrolled status
            },
            error: () => {
                this.enrolling.set(false);
            }
        });
    }

    purchaseCourse(): void {
        const course = this.course();
        if (!course) return;

        this.enrolling.set(true);
        this.paymentService.createCheckoutSession(course.id).subscribe({
            next: (response) => {
                this.paymentService.redirectToCheckout(response.checkoutUrl);
            },
            error: () => {
                this.enrolling.set(false);
            }
        });
    }
}
