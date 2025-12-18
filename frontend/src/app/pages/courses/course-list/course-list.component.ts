import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services';
import { Course, PageResponse } from '../../../core/models';
import { CourseCardComponent, CourseCardSkeletonComponent } from '../../../shared/components';

@Component({
    selector: 'app-course-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, CourseCardComponent, CourseCardSkeletonComponent],
    template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Explore Courses</h1>
        <p class="text-gray-600 mt-2">Discover courses to take your skills to the next level</p>
      </div>

      <!-- Search and Filters -->
      <div class="flex flex-col lg:flex-row gap-4 mb-8">
        <!-- Search -->
        <div class="flex-1 relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
            placeholder="Search courses..."
            class="input pl-10"
          >
        </div>

        <!-- Category Filter -->
        <select [(ngModel)]="selectedCategory" (change)="onCategoryChange()" 
          class="input w-full lg:w-48">
          <option value="">All Categories</option>
          @for (category of categories; track category) {
            <option [value]="category">{{ category }}</option>
          }
        </select>

        <!-- Sort -->
        <select [(ngModel)]="sortBy" (change)="loadCourses()" class="input w-full lg:w-48">
          <option value="createdAt">Newest</option>
          <option value="totalEnrollments">Most Popular</option>
          <option value="averageRating">Highest Rated</option>
          <option value="price">Price: Low to High</option>
        </select>
      </div>

      <!-- Results Info -->
      <div class="flex items-center justify-between mb-6">
        <p class="text-gray-600">
          @if (pageData()) {
            Showing {{ pageData()!.content.length }} of {{ pageData()!.totalElements }} courses
          }
        </p>
      </div>

      <!-- Course Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        @if (loading()) {
          @for (i of [1,2,3,4,5,6,7,8]; track i) {
            <app-course-card-skeleton />
          }
        } @else if (courses().length === 0) {
          <div class="col-span-full text-center py-12">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-gray-500 text-lg">No courses found</p>
            <p class="text-gray-400">Try adjusting your search or filters</p>
          </div>
        } @else {
          @for (course of courses(); track course.id) {
            <app-course-card [course]="course" />
          }
        }
      </div>

      <!-- Pagination -->
      @if (pageData() && pageData()!.totalPages > 1) {
        <div class="flex justify-center gap-2 mt-12">
          <button
            (click)="goToPage(currentPage() - 1)"
            [disabled]="pageData()!.first"
            class="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
              hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          
          @for (page of getPageNumbers(); track page) {
            <button
              (click)="goToPage(page)"
              class="px-4 py-2 rounded-lg transition-colors"
              [class]="page === currentPage() 
                ? 'bg-primary-500 text-white' 
                : 'border border-gray-300 hover:bg-gray-50'"
            >
              {{ page + 1 }}
            </button>
          }
          
          <button
            (click)="goToPage(currentPage() + 1)"
            [disabled]="pageData()!.last"
            class="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
              hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      }
    </div>
  `
})
export class CourseListComponent implements OnInit {
    private courseService = inject(CourseService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    courses = signal<Course[]>([]);
    pageData = signal<PageResponse<Course> | null>(null);
    loading = signal(true);
    currentPage = signal(0);

    searchQuery = '';
    selectedCategory = '';
    sortBy = 'createdAt';

    categories = [
        'Programming',
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'Design',
        'Business',
        'Marketing'
    ];

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.searchQuery = params['q'] || '';
            this.selectedCategory = params['category'] || '';
            this.currentPage.set(parseInt(params['page'] || '0'));
            this.loadCourses();
        });
    }

    loadCourses(): void {
        this.loading.set(true);

        let request;
        if (this.searchQuery) {
            request = this.courseService.searchCourses(this.searchQuery, this.currentPage(), 12);
        } else if (this.selectedCategory) {
            request = this.courseService.getCoursesByCategory(this.selectedCategory, this.currentPage(), 12);
        } else {
            request = this.courseService.getCourses(this.currentPage(), 12, this.sortBy, 'desc');
        }

        request.subscribe({
            next: (response) => {
                this.courses.set(response.content);
                this.pageData.set(response);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    onSearch(): void {
        this.currentPage.set(0);
        this.updateUrl();
        this.loadCourses();
    }

    onCategoryChange(): void {
        this.currentPage.set(0);
        this.searchQuery = '';
        this.updateUrl();
        this.loadCourses();
    }

    goToPage(page: number): void {
        if (page < 0 || (this.pageData() && page >= this.pageData()!.totalPages)) return;
        this.currentPage.set(page);
        this.updateUrl();
        this.loadCourses();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    getPageNumbers(): number[] {
        if (!this.pageData()) return [];
        const total = this.pageData()!.totalPages;
        const current = this.currentPage();
        const pages: number[] = [];

        const start = Math.max(0, current - 2);
        const end = Math.min(total, start + 5);

        for (let i = start; i < end; i++) {
            pages.push(i);
        }
        return pages;
    }

    private updateUrl(): void {
        const queryParams: any = {};
        if (this.searchQuery) queryParams.q = this.searchQuery;
        if (this.selectedCategory) queryParams.category = this.selectedCategory;
        if (this.currentPage() > 0) queryParams.page = this.currentPage();

        this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
    }
}
