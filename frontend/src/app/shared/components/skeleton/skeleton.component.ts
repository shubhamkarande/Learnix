import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="skeleton animate-pulse" [ngStyle]="{ width: width, height: height }"></div>
  `
})
export class SkeletonComponent {
    @Input() width: string = '100%';
    @Input() height: string = '1rem';
}

@Component({
    selector: 'app-course-card-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="card overflow-hidden">
      <!-- Thumbnail skeleton -->
      <div class="skeleton aspect-video"></div>
      
      <!-- Content -->
      <div class="p-4 space-y-3">
        <div class="flex items-center gap-2">
          <div class="skeleton w-6 h-6 rounded-full"></div>
          <div class="skeleton h-4 w-24"></div>
        </div>
        <div class="skeleton h-5 w-full"></div>
        <div class="skeleton h-5 w-3/4"></div>
        <div class="flex items-center gap-4">
          <div class="skeleton h-4 w-16"></div>
          <div class="skeleton h-4 w-20"></div>
        </div>
        <div class="flex justify-between items-center">
          <div class="skeleton h-6 w-16"></div>
          <div class="skeleton h-5 w-20 rounded-full"></div>
        </div>
      </div>
    </div>
  `
})
export class CourseCardSkeletonComponent { }
