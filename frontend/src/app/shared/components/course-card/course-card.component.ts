import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Course } from '../../../core/models';

@Component({
    selector: 'app-course-card',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <a [routerLink]="['/courses', course.id]" class="card block overflow-hidden group cursor-pointer">
      <!-- Thumbnail -->
      <div class="relative aspect-video overflow-hidden">
        @if (course.thumbnailUrl) {
          <img [src]="course.thumbnailUrl" [alt]="course.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
        } @else {
          <div class="w-full h-full bg-gradient-to-br from-primary-400 to-accent-500 
            flex items-center justify-center">
            <svg class="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        }
        
        <!-- Category Badge -->
        @if (course.category) {
          <span class="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-white/90 
            backdrop-blur-sm rounded-full text-gray-700">
            {{ course.category }}
          </span>
        }
        
        <!-- Duration -->
        <span class="absolute bottom-3 right-3 px-2 py-1 text-xs font-medium bg-black/70 
          text-white rounded-md">
          {{ formatDuration(course.totalDurationMinutes) }}
        </span>
      </div>

      <!-- Content -->
      <div class="p-4">
        <!-- Instructor -->
        <div class="flex items-center gap-2 mb-2">
          @if (course.instructor.avatarUrl) {
            <img [src]="course.instructor.avatarUrl" [alt]="course.instructor.name"
              class="w-6 h-6 rounded-full object-cover">
          } @else {
            <div class="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 
              flex items-center justify-center text-white text-xs font-medium">
              {{ course.instructor.name.charAt(0) }}
            </div>
          }
          <span class="text-sm text-gray-500">{{ course.instructor.name }}</span>
        </div>

        <!-- Title -->
        <h3 class="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
          {{ course.title }}
        </h3>

        <!-- Stats -->
        <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <!-- Rating -->
          @if (course.totalRatings > 0) {
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span class="font-medium text-gray-700">{{ course.averageRating.toFixed(1) }}</span>
              <span>({{ course.totalRatings }})</span>
            </div>
          }
          
          <!-- Lessons -->
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <span>{{ course.totalLessons }} lessons</span>
          </div>
        </div>

        <!-- Price & Level -->
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-primary-600">
            @if (course.price === 0) {
              Free
            } @else {
              \${{ course.price.toFixed(2) }}
            }
          </span>
          @if (course.level) {
            <span class="text-xs font-medium px-2 py-1 rounded-full"
              [class]="getLevelClass(course.level)">
              {{ course.level }}
            </span>
          }
        </div>
      </div>
    </a>
  `
})
export class CourseCardComponent {
    @Input({ required: true }) course!: Course;

    formatDuration(minutes: number): string {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }

    getLevelClass(level: string): string {
        const classes: Record<string, string> = {
            'BEGINNER': 'bg-green-100 text-green-700',
            'INTERMEDIATE': 'bg-yellow-100 text-yellow-700',
            'ADVANCED': 'bg-red-100 text-red-700'
        };
        return classes[level] || 'bg-gray-100 text-gray-700';
    }
}
