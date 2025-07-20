import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { Course, Review } from '../../../models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="course" class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="bg-gray-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
              <div class="mb-4">
                <span class="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">{{course.category}}</span>
                <span class="ml-2 text-gray-300">{{course.level}}</span>
              </div>
              <h1 class="text-3xl md:text-4xl font-bold mb-4">{{course.title}}</h1>
              <p class="text-xl text-gray-300 mb-6">{{course.description}}</p>
              
              <div class="flex flex-wrap items-center gap-6 text-sm">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                  <span>{{course.rating}} ({{course.totalRatings}} reviews)</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-300 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                  <span>{{course.enrolledStudents.toLocaleString()}} students</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-300 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{{course.duration}}</span>
                </div>
              </div>

              <div class="flex items-center mt-6">
                <img [src]="course.instructor.avatar" [alt]="course.instructor.name" class="w-12 h-12 rounded-full mr-4">
                <div>
                  <div class="font-semibold">{{course.instructor.name}}</div>
                  <div class="text-gray-300 text-sm">{{course.instructor.bio}}</div>
                </div>
              </div>
            </div>

            <!-- Course Preview Card -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <div class="relative mb-4">
                  <iframe 
                    [src]="course.videoUrl" 
                    class="w-full h-48 rounded-lg"
                    frameborder="0" 
                    allow="autoplay; fullscreen; picture-in-picture">
                  </iframe>
                </div>
                <div class="text-3xl font-bold text-gray-900 mb-4">\${{course.price}}</div>
                <button 
                  (click)="enrollInCourse()" 
                  [disabled]="enrolling"
                  class="w-full btn-primary mb-4 disabled:opacity-50"
                >
                  <span *ngIf="enrolling">Enrolling...</span>
                  <span *ngIf="!enrolling">Enroll Now</span>
                </button>
                <div class="text-center text-sm text-gray-500 mb-4">30-day money-back guarantee</div>
                
                <div class="space-y-3 text-sm">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Lifetime access</span>
                  </div>
                  <div class="flex items-center">
                    <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Certificate of completion</span>
                  </div>
                  <div class="flex items-center">
                    <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Mobile and desktop access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <!-- What you'll learn -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">What you'll learn</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div *ngFor="let tag of course.tags" class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-700">{{tag}}</span>
                </div>
              </div>
            </div>

            <!-- Course Content -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Course Content</h3>
              <div class="space-y-3">
                <div *ngFor="let chapter of course.chapters; let i = index" class="border border-gray-200 rounded-lg">
                  <div class="p-4 cursor-pointer hover:bg-gray-50" (click)="toggleChapter(i)">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-900 mr-3">{{i + 1}}.</span>
                        <div>
                          <h4 class="font-medium text-gray-900">{{chapter.title}}</h4>
                          <p class="text-sm text-gray-600">{{chapter.description}}</p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-500">{{chapter.duration}}</span>
                        <svg [class.rotate-180]="expandedChapters[i]" class="w-4 h-4 text-gray-400 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div *ngIf="expandedChapters[i]" class="px-4 pb-4">
                    <div class="bg-gray-50 rounded p-3 text-sm text-gray-600">
                      {{chapter.description}}
                      <div *ngIf="chapter.quiz" class="mt-2 text-primary-600">
                        ✓ Includes quiz
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Instructor -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Your Instructor</h3>
              <div class="flex items-start space-x-4">
                <img [src]="course.instructor.avatar" [alt]="course.instructor.name" class="w-16 h-16 rounded-full">
                <div class="flex-1">
                  <h4 class="font-semibold text-lg text-gray-900">{{course.instructor.name}}</h4>
                  <p class="text-gray-600 mb-3">{{course.instructor.bio}}</p>
                  <div class="flex items-center space-x-6 text-sm">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                      <span>{{course.instructor.rating}} instructor rating</span>
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      <span>{{course.instructor.totalStudents.toLocaleString()}} students</span>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2 mt-3">
                    <span *ngFor="let skill of course.instructor.expertise" class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {{skill}}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reviews -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Student Reviews</h3>
              <div class="space-y-6">
                <div *ngFor="let review of reviews" class="border-b border-gray-200 pb-6 last:border-b-0">
                  <div class="flex items-start space-x-4">
                    <img [src]="review.userAvatar" [alt]="review.userName" class="w-10 h-10 rounded-full">
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-2">
                        <h4 class="font-medium text-gray-900">{{review.userName}}</h4>
                        <div class="flex items-center">
                          <svg *ngFor="let star of [1,2,3,4,5]" 
                               [class.text-yellow-400]="star <= review.rating"
                               [class.text-gray-300]="star > review.rating"
                               class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        </div>
                      </div>
                      <p class="text-gray-600">{{review.comment}}</p>
                      <p class="text-sm text-gray-400 mt-2">{{review.createdAt | date:'short'}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 class="font-semibold text-lg text-gray-900 mb-4">Course Tags</h3>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let tag of course.tags" class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {{tag}}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div *ngIf="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full animate-slide-up">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Successfully Enrolled!</h3>
          <p class="text-gray-600 mb-6">You can now access this course from your dashboard.</p>
          <div class="flex space-x-3">
            <button (click)="goToDashboard()" class="flex-1 btn-primary">Go to Dashboard</button>
            <button (click)="closeModal()" class="flex-1 btn-secondary">Continue Browsing</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  reviews: Review[] = [];
  expandedChapters: boolean[] = [];
  enrolling = false;
  showSuccessModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseService.getCourse(courseId).subscribe(course => {
        if (course) {
          this.course = course;
          this.expandedChapters = new Array(course.chapters.length).fill(false);
        }
      });

      this.courseService.getReviews(courseId).subscribe(reviews => {
        this.reviews = reviews;
      });
    }
  }

  toggleChapter(index: number): void {
    this.expandedChapters[index] = !this.expandedChapters[index];
  }

  enrollInCourse(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.course) {
      this.enrolling = true;
      this.courseService.enrollInCourse(this.course.id).subscribe(response => {
        this.enrolling = false;
        if (response.success) {
          this.showSuccessModal = true;
        }
      });
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  closeModal(): void {
    this.showSuccessModal = false;
  }
}