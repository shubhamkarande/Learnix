import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { User } from '../../models/user.model';
import { Course, CourseProgress } from '../../models/course.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="currentUser" class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Welcome back, {{currentUser.name}}!</h1>
              <p class="text-gray-600 mt-1">Continue your learning journey</p>
            </div>
            <div class="hidden md:flex items-center space-x-6 text-sm">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600">{{currentUser.enrolledCourses.length}}</div>
                <div class="text-gray-500">Enrolled Courses</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-accent-600">{{currentUser.completedCourses.length}}</div>
                <div class="text-gray-500">Completed</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-secondary-600">{{currentUser.totalLearningHours}}h</div>
                <div class="text-gray-500">Learning Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Quick Stats (Mobile) -->
        <div class="md:hidden grid grid-cols-3 gap-4 mb-8">
          <div class="bg-white rounded-lg p-4 text-center shadow-sm">
            <div class="text-xl font-bold text-primary-600">{{currentUser.enrolledCourses.length}}</div>
            <div class="text-xs text-gray-500">Enrolled</div>
          </div>
          <div class="bg-white rounded-lg p-4 text-center shadow-sm">
            <div class="text-xl font-bold text-accent-600">{{currentUser.completedCourses.length}}</div>
            <div class="text-xs text-gray-500">Completed</div>
          </div>
          <div class="bg-white rounded-lg p-4 text-center shadow-sm">
            <div class="text-xl font-bold text-secondary-600">{{currentUser.totalLearningHours}}h</div>
            <div class="text-xs text-gray-500">Time</div>
          </div>
        </div>

        <!-- Continue Learning -->
        <div *ngIf="continueCoursesWithProgress.length > 0" class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Continue Learning</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let item of continueCoursesWithProgress" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <img [src]="item.course.thumbnail" [alt]="item.course.title" class="w-full h-32 object-cover">
              <div class="p-4">
                <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">{{item.course.title}}</h3>
                <div class="mb-3">
                  <div class="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{{item.progress.progressPercentage}}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                         [style.width.%]="item.progress.progressPercentage"></div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500">Last accessed: {{item.progress.lastAccessed | date:'short'}}</span>
                  <a [routerLink]="['/learn', item.course.id]" class="btn-primary text-sm">Continue</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enrolled Courses -->
        <div *ngIf="enrolledCourses.length > 0" class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let course of enrolledCourses" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <img [src]="course.thumbnail" [alt]="course.title" class="w-full h-32 object-cover">
              <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">{{course.category}}</span>
                  <div class="flex items-center text-sm text-gray-500">
                    <svg class="w-4 h-4 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <span>{{course.rating}}</span>
                  </div>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">{{course.title}}</h3>
                <div class="flex items-center mb-3">
                  <img [src]="course.instructor.avatar" [alt]="course.instructor.name" class="w-6 h-6 rounded-full mr-2">
                  <span class="text-sm text-gray-600">{{course.instructor.name}}</span>
                </div>
                <a [routerLink]="['/learn', course.id]" class="block btn-primary text-center text-sm">Start Learning</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="enrolledCourses.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No courses enrolled yet</h3>
          <p class="text-gray-500 mb-6">Start your learning journey by enrolling in a course</p>
          <a routerLink="/courses" class="btn-primary">Browse Courses</a>
        </div>

        <!-- Recommendations -->
        <div *ngIf="recommendedCourses.length > 0" class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let course of recommendedCourses" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <img [src]="course.thumbnail" [alt]="course.title" class="w-full h-32 object-cover">
              <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs bg-secondary-100 text-secondary-600 px-2 py-1 rounded-full">{{course.category}}</span>
                  <span class="font-bold text-primary-600">\${{course.price}}</span>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">{{course.title}}</h3>
                <div class="flex items-center mb-3">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <span class="text-sm text-gray-600">{{course.rating}}</span>
                  </div>
                  <span class="ml-auto text-sm text-gray-500">{{course.duration}}</span>
                </div>
                <a [routerLink]="['/course', course.id]" class="block btn-secondary text-center text-sm">Learn More</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  enrolledCourses: Course[] = [];
  recommendedCourses: Course[] = [];
  continueCoursesWithProgress: { course: Course; progress: CourseProgress }[] = [];
  progressData: { [courseId: string]: CourseProgress } = {};

  constructor(
    private authService: AuthService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserCourses();
      }
    });

    this.courseService.progress$.subscribe(progress => {
      this.progressData = progress;
      if (this.currentUser) {
        this.updateContinueLearning();
      }
    });
  }

  private loadUserCourses(): void {
    if (!this.currentUser) return;

    this.courseService.getCourses().subscribe(allCourses => {
      // Filter enrolled courses
      this.enrolledCourses = allCourses.filter(course => 
        this.currentUser!.enrolledCourses.includes(course.id)
      );

      // Get recommended courses (not enrolled)
      this.recommendedCourses = allCourses.filter(course => 
        !this.currentUser!.enrolledCourses.includes(course.id)
      ).slice(0, 3);

      this.updateContinueLearning();
    });
  }

  private updateContinueLearning(): void {
    this.continueCoursesWithProgress = this.enrolledCourses
      .map(course => ({
        course,
        progress: this.progressData[course.id]
      }))
      .filter(item => item.progress && item.progress.progressPercentage > 0 && item.progress.progressPercentage < 100)
      .sort((a, b) => new Date(b.progress.lastAccessed).getTime() - new Date(a.progress.lastAccessed).getTime())
      .slice(0, 3);
  }
}