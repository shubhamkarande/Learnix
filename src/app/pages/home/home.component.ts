import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="relative container-responsive py-16 sm:py-20 lg:py-32">
        <div class="text-center animate-fade-in">
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight px-4 sm:px-0">
            Stream. Learn. <span class="text-yellow-300">Grow.</span>
          </h1>
          <p class="text-lg sm:text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto px-4 sm:px-0">
            Transform your skills with our comprehensive online learning platform. Learn from industry experts and advance your career.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <a routerLink="/courses" class="btn-primary bg-white text-primary-600 hover:bg-gray-100 font-semibold">
              Start Learning Today
              <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
            <a href="#features" class="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-lg transition-colors inline-flex items-center justify-center min-h-[44px]">
              Learn More
            </a>
          </div>
        </div>
      </div>
      
      <!-- Decorative elements -->
      <div class="absolute top-20 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse-subtle"></div>
      <div class="absolute bottom-20 right-10 w-16 h-16 bg-white rounded-full opacity-10 animate-pulse-subtle"></div>
    </section>

    <!-- Stats Section -->
    <section class="section-padding-sm bg-gray-50">
      <div class="container-responsive">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          <div class="animate-slide-up">
            <div class="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-2">10,000+</div>
            <div class="text-sm sm:text-base text-gray-600">Students Enrolled</div>
          </div>
          <div class="animate-slide-up">
            <div class="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-2">500+</div>
            <div class="text-sm sm:text-base text-gray-600">Expert Instructors</div>
          </div>
          <div class="animate-slide-up">
            <div class="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-2">1,200+</div>
            <div class="text-sm sm:text-base text-gray-600">Courses Available</div>
          </div>
          <div class="animate-slide-up">
            <div class="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-2">95%</div>
            <div class="text-sm sm:text-base text-gray-600">Completion Rate</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Courses -->
    <section id="courses" class="section-padding">
      <div class="container-responsive">
        <div class="text-center mb-12 sm:mb-16">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Courses</h2>
          <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">Discover our most popular courses designed by industry experts</p>
        </div>

        <div class="grid-responsive-1-2-3 mb-8 sm:mb-12">
          <div *ngFor="let course of featuredCourses" class="card group hover:scale-105 transition-transform duration-300 desktop-animate">
            <div class="relative overflow-hidden rounded-t-xl">
              <img [src]="course.thumbnail" [alt]="course.title" class="img-responsive h-48 sm:h-52 group-hover:scale-110 transition-transform duration-300">
              <div class="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white px-2 py-1 rounded-full text-xs font-semibold text-primary-600">
                {{course.category}}
              </div>
              <div class="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                {{course.duration}}
              </div>
            </div>
            <div class="p-4 sm:p-6">
              <div class="flex items-center mb-2 text-sm">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                  <span class="ml-1 text-gray-600">{{course.rating}} ({{course.totalRatings}})</span>
                </div>
                <span class="ml-auto text-gray-500">{{course.level}}</span>
              </div>
              <h3 class="font-semibold text-lg sm:text-xl text-gray-900 mb-2 line-clamp-2">{{course.title}}</h3>
              <p class="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">{{course.description}}</p>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center min-w-0 flex-1">
                  <img [src]="course.instructor.avatar" [alt]="course.instructor.name" class="w-8 h-8 rounded-full mr-2 flex-shrink-0">
                  <span class="text-sm text-gray-600 truncate">{{course.instructor.name}}</span>
                </div>
                <div class="font-bold text-primary-600 text-lg ml-2">\${{course.price}}</div>
              </div>
              <a [routerLink]="['/course', course.id]" class="btn-primary w-full">View Course</a>
            </div>
          </div>
        </div>

        <div class="text-center">
          <a routerLink="/courses" class="btn-secondary">View All Courses</a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="section-padding bg-gray-50">
      <div class="container-responsive">
        <div class="text-center mb-12 sm:mb-16">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Learnix?</h2>
          <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">Experience learning like never before with our innovative platform</p>
        </div>

        <div class="grid-responsive-1-2-3">
          <div class="text-center p-6 sm:p-8 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow desktop-hover">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg class="w-7 h-7 sm:w-8 sm:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Expert-Led Courses</h3>
            <p class="text-sm sm:text-base text-gray-600">Learn from industry professionals with years of real-world experience</p>
          </div>

          <div class="text-center p-6 sm:p-8 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow desktop-hover">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg class="w-7 h-7 sm:w-8 sm:h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Interactive Learning</h3>
            <p class="text-sm sm:text-base text-gray-600">Engage with quizzes, projects, and hands-on exercises for better retention</p>
          </div>

          <div class="text-center p-6 sm:p-8 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow desktop-hover">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg class="w-7 h-7 sm:w-8 sm:h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Lifetime Access</h3>
            <p class="text-sm sm:text-base text-gray-600">Access your courses anytime, anywhere with lifetime access and updates</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section-padding bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div class="container-narrow text-center">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
        <p class="text-lg sm:text-xl mb-8 text-blue-100 px-4 sm:px-0">Join thousands of learners and transform your career today</p>
        <a routerLink="/signup" class="btn-primary bg-white text-primary-600 hover:bg-gray-100 font-semibold w-full sm:w-auto">
          Get Started Now
          <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  featuredCourses: Course[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.featuredCourses = courses.slice(0, 3);
    });
  }
}