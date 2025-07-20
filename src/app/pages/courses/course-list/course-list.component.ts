import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Courses</h1>
          <p class="text-xl text-gray-600">Discover thousands of courses from expert instructors</p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Search and Filters -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div class="flex flex-col lg:flex-row gap-4">
            <!-- Search -->
            <div class="flex-1">
              <div class="relative">
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (input)="onSearch()"
                  placeholder="Search courses..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            <!-- Filters -->
            <div class="flex flex-col sm:flex-row gap-4">
              <select [(ngModel)]="selectedCategory" (change)="onFilter()" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
              </select>

              <select [(ngModel)]="selectedLevel" (change)="onFilter()" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <select [(ngModel)]="sortBy" (change)="onSort()" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Results Info -->
        <div class="flex justify-between items-center mb-6">
          <p class="text-gray-600">Showing {{filteredCourses.length}} courses</p>
          <div class="flex items-center space-x-2">
            <button 
              (click)="viewMode = 'grid'" 
              [class.bg-primary-600]="viewMode === 'grid'"
              [class.text-white]="viewMode === 'grid'"
              class="p-2 rounded border hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </button>
            <button 
              (click)="viewMode = 'list'" 
              [class.bg-primary-600]="viewMode === 'list'"
              [class.text-white]="viewMode === 'list'"
              class="p-2 rounded border hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Course Grid -->
        <div *ngIf="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let course of filteredCourses" class="card group hover:scale-105 transition-transform duration-300">
            <div class="relative overflow-hidden rounded-t-xl">
              <img [src]="course.thumbnail" [alt]="course.title" class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300">
              <div class="absolute top-4 left-4 bg-white px-2 py-1 rounded-full text-xs font-semibold text-primary-600">
                {{course.category}}
              </div>
              <div class="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                {{course.duration}}
              </div>
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                  <span class="ml-1 text-sm text-gray-600">{{course.rating}} ({{course.totalRatings}})</span>
                </div>
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{{course.level}}</span>
              </div>
              <h3 class="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{{course.title}}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{course.description}}</p>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <img [src]="course.instructor.avatar" [alt]="course.instructor.name" class="w-8 h-8 rounded-full mr-2">
                  <span class="text-sm text-gray-600">{{course.instructor.name}}</span>
                </div>
                <div class="font-bold text-primary-600">\${{course.price}}</div>
              </div>
              <a [routerLink]="['/course', course.id]" class="block btn-primary text-center">View Course</a>
            </div>
          </div>
        </div>

        <!-- Course List -->
        <div *ngIf="viewMode === 'list'" class="space-y-6">
          <div *ngFor="let course of filteredCourses" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div class="flex flex-col lg:flex-row gap-6">
              <div class="lg:w-80 flex-shrink-0">
                <img [src]="course.thumbnail" [alt]="course.title" class="w-full h-48 lg:h-32 object-cover rounded-lg">
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">{{course.category}}</span>
                  <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{{course.level}}</span>
                  <span class="text-xs text-gray-500">{{course.duration}}</span>
                </div>
                <h3 class="font-semibold text-xl text-gray-900 mb-2">{{course.title}}</h3>
                <p class="text-gray-600 mb-3">{{course.description}}</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="flex items-center">
                      <img [src]="course.instructor.avatar" [alt]="course.instructor.name" class="w-6 h-6 rounded-full mr-2">
                      <span class="text-sm text-gray-600">{{course.instructor.name}}</span>
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                      <span class="ml-1 text-sm text-gray-600">{{course.rating}} ({{course.totalRatings}})</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <div class="font-bold text-xl text-primary-600">\${{course.price}}</div>
                    <a [routerLink]="['/course', course.id]" class="btn-primary">View Course</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredCourses.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5.291-2.709M10 7a8 8 0 1116 0v3.291"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
          <p class="mt-1 text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
        </div>
      </div>
    </div>
  `
})
export class CourseListComponent implements OnInit {
  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  searchQuery = '';
  selectedCategory = '';
  selectedLevel = '';
  sortBy = 'popular';
  viewMode: 'grid' | 'list' = 'grid';

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.allCourses = courses;
      this.filteredCourses = courses;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilter(): void {
    this.applyFilters();
  }

  onSort(): void {
    this.applySorting();
  }

  private applyFilters(): void {
    this.courseService.searchCourses(this.searchQuery, this.selectedCategory, this.selectedLevel)
      .subscribe(courses => {
        this.filteredCourses = courses;
        this.applySorting();
      });
  }

  private applySorting(): void {
    switch (this.sortBy) {
      case 'rating':
        this.filteredCourses.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        this.filteredCourses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'price-low':
        this.filteredCourses.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredCourses.sort((a, b) => b.price - a.price);
        break;
      default:
        this.filteredCourses.sort((a, b) => b.enrolledStudents - a.enrolledStudents);
    }
  }
}