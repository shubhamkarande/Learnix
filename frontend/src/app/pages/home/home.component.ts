import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../core/services';
import { Course } from '../../core/models';
import { CourseCardComponent, CourseCardSkeletonComponent } from '../../shared/components';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CourseCardComponent, CourseCardSkeletonComponent],
  template: `
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-20 lg:py-32 dark:bg-gray-950">
      <!-- Background decorations -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-0 -left-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 -right-40 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span class="gradient-text">Stream. Learn. Grow.</span>
            <br>
            <span class="text-gray-900 dark:text-white">Master New Skills Today</span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of learners on the most modern video learning platform. 
            Learn from expert instructors and earn certificates to boost your career.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a routerLink="/courses" class="btn-primary text-lg px-8 py-4">
              Explore Courses
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
            <a routerLink="/auth/register" class="btn-secondary text-lg px-8 py-4">
              Start Teaching
            </a>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div class="text-center">
              <div class="text-3xl font-bold gradient-text">10K+</div>
              <div class="text-gray-500 dark:text-gray-400">Students</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold gradient-text">500+</div>
              <div class="text-gray-500 dark:text-gray-400">Courses</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold gradient-text">50+</div>
              <div class="text-gray-500 dark:text-gray-400">Instructors</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Top Courses Section -->
    <section class="py-16 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Most Popular Courses</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Learn from our highest-rated courses</p>
        </div>

        <!-- Course Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @if (loadingTop()) {
            @for (i of [1,2,3,4,5,6]; track i) {
              <app-course-card-skeleton />
            }
          } @else {
            @for (course of topCourses(); track course.id) {
              <app-course-card [course]="course" />
            }
          }
        </div>

        <!-- View All Button -->
        <div class="text-center mt-10">
          <a routerLink="/courses" class="inline-flex items-center gap-2 px-6 py-3 text-primary-600 dark:text-primary-400 font-medium 
            bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">
            View All Courses
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 dark:bg-gray-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Why Choose Learnix?</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Everything you need to accelerate your learning journey</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Feature 1 -->
          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 
              flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-lg mb-2 dark:text-white">HD Video Lessons</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">Crystal clear video quality with adaptive streaming</p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 
              flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138c.179.713.569 1.36 1.105 1.846.536.486.947 1.1 1.2 1.795a3.42 3.42 0 01-1.796 4.134 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-lg mb-2 dark:text-white">Earn Certificates</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">Get verified certificates upon course completion</p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 
              flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-lg mb-2 dark:text-white">Learn at Your Pace</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">Access courses anytime, anywhere, on any device</p>
          </div>

          <!-- Feature 4 -->
          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 
              flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-lg mb-2 dark:text-white">Expert Instructors</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">Learn from industry professionals and experts</p>
          </div>
        </div>
      </div>
    </section>

    <!-- New Courses Section -->
    <section class="py-16 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Newly Added</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Fresh content just for you</p>
        </div>

        <!-- Course Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @if (loadingNew()) {
            @for (i of [1,2,3,4,5,6]; track i) {
              <app-course-card-skeleton />
            }
          } @else {
            @for (course of newCourses(); track course.id) {
              <app-course-card [course]="course" />
            }
          }
        </div>

        <!-- View All Button -->
        <div class="text-center mt-10">
          <a routerLink="/courses" class="inline-flex items-center gap-2 px-6 py-3 text-primary-600 dark:text-primary-400 font-medium 
            bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">
            Browse All Courses
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 dark:bg-gray-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-accent-600 p-12 text-center">
          <div class="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10"></div>
          <div class="relative">
            <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p class="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join our community of learners and start your journey to mastering new skills today.
            </p>
            <a routerLink="/auth/register" class="inline-flex items-center gap-2 px-8 py-4 bg-white 
              text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
              Get Started for Free
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  private courseService = inject(CourseService);

  topCourses = signal<Course[]>([]);
  newCourses = signal<Course[]>([]);
  loadingTop = signal(true);
  loadingNew = signal(true);

  ngOnInit(): void {
    this.loadTopCourses();
    this.loadNewCourses();
  }

  private loadTopCourses(): void {
    this.courseService.getTopCourses(6).subscribe({
      next: (courses) => {
        this.topCourses.set(courses);
        this.loadingTop.set(false);
      },
      error: () => this.loadingTop.set(false)
    });
  }

  private loadNewCourses(): void {
    this.courseService.getNewCourses(6).subscribe({
      next: (courses) => {
        this.newCourses.set(courses);
        this.loadingNew.set(false);
      },
      error: () => this.loadingNew.set(false)
    });
  }
}
