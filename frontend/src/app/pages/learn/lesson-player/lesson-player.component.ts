import { Component, OnInit, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CourseService, LessonService, EnrollmentService } from '../../../core/services';
import { Course, Lesson } from '../../../core/models';
import { ProgressBarComponent } from '../../../shared/components';

@Component({
    selector: 'app-lesson-player',
    standalone: true,
    imports: [CommonModule, RouterModule, ProgressBarComponent],
    template: `
    <div class="flex h-[calc(100vh-4rem)]">
      <!-- Video Player Section -->
      <div class="flex-1 flex flex-col bg-black">
        <!-- Video -->
        <div class="flex-1 flex items-center justify-center">
          @if (currentLesson()?.videoUrl) {
            <video
              #videoPlayer
              class="max-w-full max-h-full"
              [src]="currentLesson()!.videoUrl"
              controls
              autoplay
              (timeupdate)="onTimeUpdate($event)"
              (ended)="onVideoEnded()"
            ></video>
          } @else {
            <div class="text-white text-center">
              <svg class="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <p>Video not available</p>
            </div>
          }
        </div>

        <!-- Video Controls Bar -->
        <div class="bg-surface-900 p-4">
          <div class="max-w-4xl mx-auto">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-white font-semibold text-lg">{{ currentLesson()?.title }}</h1>
                <p class="text-white/60 text-sm">{{ course()?.title }}</p>
              </div>
              <div class="flex items-center gap-4">
                <button
                  (click)="previousLesson()"
                  [disabled]="!hasPrevious()"
                  class="px-4 py-2 text-white/80 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <button
                  (click)="markComplete()"
                  [disabled]="currentLesson()?.completed"
                  class="btn-primary py-2 disabled:opacity-50"
                >
                  @if (currentLesson()?.completed) {
                    ✓ Completed
                  } @else {
                    Mark Complete
                  }
                </button>
                <button
                  (click)="nextLesson()"
                  [disabled]="!hasNext()"
                  class="px-4 py-2 text-white/80 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar - Lesson List -->
      <div class="w-80 bg-white border-l border-gray-200 overflow-y-auto scrollbar-custom">
        <div class="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 class="font-semibold text-gray-900">Course Content</h2>
          @if (course()) {
            <div class="mt-2">
              <app-progress-bar [progress]="progressPercentage()" size="sm" />
              <p class="text-xs text-gray-500 mt-1">{{ completedLessonsCount() }}/{{ lessons().length }} completed</p>
            </div>
          }
        </div>

        <div class="p-2">
          @for (lesson of lessons(); track lesson.id; let i = $index) {
            <button
              (click)="selectLesson(lesson)"
              class="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors"
              [class]="lesson.id === currentLesson()?.id 
                ? 'bg-primary-50 text-primary-700' 
                : 'hover:bg-gray-50'"
            >
              <!-- Checkbox / Number -->
              <div class="flex-shrink-0">
                @if (lesson.completed) {
                  <div class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                } @else {
                  <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium"
                    [class]="lesson.id === currentLesson()?.id ? 'border-primary-500 text-primary-500' : 'border-gray-300 text-gray-500'">
                    {{ i + 1 }}
                  </div>
                }
              </div>

              <!-- Lesson Info -->
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm truncate"
                  [class]="lesson.id === currentLesson()?.id ? 'text-primary-700' : 'text-gray-900'">
                  {{ lesson.title }}
                </p>
                <p class="text-xs text-gray-500">{{ formatDuration(lesson.durationSeconds) }}</p>
              </div>

              <!-- Playing Indicator -->
              @if (lesson.id === currentLesson()?.id) {
                <div class="flex items-center gap-0.5">
                  <span class="w-0.5 h-3 bg-primary-500 animate-pulse"></span>
                  <span class="w-0.5 h-4 bg-primary-500 animate-pulse" style="animation-delay: 0.1s"></span>
                  <span class="w-0.5 h-2 bg-primary-500 animate-pulse" style="animation-delay: 0.2s"></span>
                </div>
              }
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class LessonPlayerComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private courseService = inject(CourseService);
    private lessonService = inject(LessonService);
    private enrollmentService = inject(EnrollmentService);

    course = signal<Course | null>(null);
    lessons = signal<Lesson[]>([]);
    currentLesson = signal<Lesson | null>(null);
    progressPercentage = signal(0);

    private progressUpdateInterval: any;

    ngOnInit(): void {
        const courseId = this.route.snapshot.paramMap.get('courseId');
        const lessonId = this.route.snapshot.paramMap.get('lessonId');

        if (courseId && lessonId) {
            this.loadCourse(courseId, lessonId);
        }

        // Auto-save progress every 10 seconds
        this.progressUpdateInterval = setInterval(() => this.saveProgress(), 10000);
    }

    ngOnDestroy(): void {
        if (this.progressUpdateInterval) {
            clearInterval(this.progressUpdateInterval);
        }
        this.saveProgress();
    }

    private loadCourse(courseId: string, lessonId: string): void {
        this.courseService.getCourseById(courseId).subscribe({
            next: (course) => {
                this.course.set(course);

                // Flatten lessons
                const allLessons = [
                    ...(course.modules?.flatMap(m => m.lessons) || []),
                    ...(course.lessons || [])
                ].sort((a, b) => a.orderIndex - b.orderIndex);

                this.lessons.set(allLessons);
                this.updateProgress();

                // Load specific lesson
                this.loadLesson(lessonId);
            }
        });
    }

    private loadLesson(lessonId: string): void {
        this.lessonService.getLesson(lessonId).subscribe({
            next: (lesson) => {
                this.currentLesson.set(lesson);
            }
        });
    }

    selectLesson(lesson: Lesson): void {
        const course = this.course();
        if (!course) return;

        this.currentLesson.set(lesson);
        this.router.navigate(['/learn', course.id, 'lesson', lesson.id], { replaceUrl: true });
        this.loadLesson(lesson.id);
    }

    previousLesson(): void {
        const lessons = this.lessons();
        const current = this.currentLesson();
        if (!current) return;

        const currentIndex = lessons.findIndex(l => l.id === current.id);
        if (currentIndex > 0) {
            this.selectLesson(lessons[currentIndex - 1]);
        }
    }

    nextLesson(): void {
        const lessons = this.lessons();
        const current = this.currentLesson();
        if (!current) return;

        const currentIndex = lessons.findIndex(l => l.id === current.id);
        if (currentIndex < lessons.length - 1) {
            this.selectLesson(lessons[currentIndex + 1]);
        }
    }

    hasPrevious(): boolean {
        const lessons = this.lessons();
        const current = this.currentLesson();
        if (!current) return false;
        return lessons.findIndex(l => l.id === current.id) > 0;
    }

    hasNext(): boolean {
        const lessons = this.lessons();
        const current = this.currentLesson();
        if (!current) return false;
        return lessons.findIndex(l => l.id === current.id) < lessons.length - 1;
    }

    markComplete(): void {
        const lesson = this.currentLesson();
        if (!lesson || lesson.completed) return;

        this.enrollmentService.markLessonComplete(lesson.id).subscribe({
            next: () => {
                // Update local state
                const updated = { ...lesson, completed: true };
                this.currentLesson.set(updated);

                const lessons = this.lessons().map(l =>
                    l.id === lesson.id ? updated : l
                );
                this.lessons.set(lessons);
                this.updateProgress();
            }
        });
    }

    onTimeUpdate(event: Event): void {
        const video = event.target as HTMLVideoElement;
        const lesson = this.currentLesson();
        if (lesson) {
            lesson.watchedSeconds = Math.floor(video.currentTime);
        }
    }

    onVideoEnded(): void {
        this.markComplete();
        if (this.hasNext()) {
            setTimeout(() => this.nextLesson(), 1500);
        }
    }

    private saveProgress(): void {
        const lesson = this.currentLesson();
        if (!lesson || !lesson.watchedSeconds) return;

        this.enrollmentService.updateLessonProgress(lesson.id, {
            watchedSeconds: lesson.watchedSeconds,
            progressPercentage: Math.floor((lesson.watchedSeconds / lesson.durationSeconds) * 100),
            completed: false
        }).subscribe();
    }

    private updateProgress(): void {
        const lessons = this.lessons();
        const completed = lessons.filter(l => l.completed).length;
        this.progressPercentage.set(Math.floor((completed / lessons.length) * 100));
    }

    completedLessonsCount(): number {
        return this.lessons().filter(l => l.completed).length;
    }

    formatDuration(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}
