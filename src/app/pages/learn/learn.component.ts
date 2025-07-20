import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course, Chapter } from '../../models/course.model';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="course" class="min-h-screen bg-gray-900 text-white">
      <div class="flex">
        <!-- Sidebar -->
        <div class="w-80 bg-gray-800 h-screen overflow-y-auto">
          <div class="p-4 border-b border-gray-700">
            <h2 class="font-semibold text-lg line-clamp-2">{{course.title}}</h2>
            <div class="mt-2">
              <div class="flex justify-between text-sm text-gray-300 mb-1">
                <span>Progress</span>
                <span>{{progressPercentage}}%</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                     [style.width.%]="progressPercentage"></div>
              </div>
            </div>
          </div>
          
          <div class="p-4">
            <h3 class="font-medium text-gray-300 mb-4">Course Content</h3>
            <div class="space-y-2">
              <div *ngFor="let chapter of course.chapters; let i = index" 
                   (click)="selectChapter(i)"
                   [class.bg-primary-600]="selectedChapterIndex === i"
                   [class.bg-gray-700]="selectedChapterIndex !== i && isChapterCompleted(chapter.id)"
                   [class.hover:bg-gray-700]="selectedChapterIndex !== i"
                   class="p-3 rounded-lg cursor-pointer transition-colors">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 mt-1">
                    <div *ngIf="isChapterCompleted(chapter.id)" class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div *ngIf="!isChapterCompleted(chapter.id)" class="w-5 h-5 border-2 border-gray-500 rounded-full"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-sm mb-1 line-clamp-2">{{chapter.title}}</h4>
                    <p class="text-xs text-gray-400">{{chapter.duration}}</p>
                    <div *ngIf="chapter.quiz" class="text-xs text-yellow-400 mt-1">
                      Quiz Available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
          <!-- Video Player -->
          <div class="bg-black">
            <div class="relative">
              <iframe 
                [src]="currentChapter?.videoUrl" 
                class="w-full h-96 lg:h-[500px]"
                frameborder="0" 
                allow="autoplay; fullscreen; picture-in-picture">
              </iframe>
            </div>
          </div>

          <!-- Chapter Info and Controls -->
          <div class="flex-1 bg-gray-900 p-6">
            <div class="max-w-4xl mx-auto">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h1 class="text-2xl font-bold mb-2">{{currentChapter?.title}}</h1>
                  <p class="text-gray-300">{{currentChapter?.description}}</p>
                </div>
                <div class="flex items-center space-x-3">
                  <button 
                    (click)="markAsCompleted()"
                    [disabled]="isChapterCompleted(currentChapter?.id || '')"
                    [class.bg-green-600]="isChapterCompleted(currentChapter?.id || '')"
                    [class.bg-primary-600]="!isChapterCompleted(currentChapter?.id || '')"
                    class="px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    <span *ngIf="isChapterCompleted(currentChapter?.id || '')">✓ Completed</span>
                    <span *ngIf="!isChapterCompleted(currentChapter?.id || '')">Mark as Complete</span>
                  </button>
                </div>
              </div>

              <!-- Navigation -->
              <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
                <button 
                  (click)="previousChapter()"
                  [disabled]="selectedChapterIndex === 0"
                  class="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Previous
                </button>

                <!-- Quiz Button -->
                <button 
                  *ngIf="currentChapter?.quiz"
                  (click)="takeQuiz()"
                  class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors font-medium"
                >
                  Take Quiz
                </button>

                <button 
                  (click)="nextChapter()"
                  [disabled]="selectedChapterIndex === course.chapters.length - 1"
                  class="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LearnComponent implements OnInit {
  course: Course | null = null;
  currentChapter: Chapter | null = null;
  selectedChapterIndex = 0;
  completedChapters: string[] = [];
  progressPercentage = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseService.getCourse(courseId).subscribe(course => {
        if (course) {
          this.course = course;
          this.currentChapter = course.chapters[0];
          this.loadProgress(courseId);
        }
      });
    }
  }

  private loadProgress(courseId: string): void {
    const progress = this.courseService.getProgress(courseId);
    if (progress) {
      this.completedChapters = progress.completedChapters;
      this.calculateProgress();
    }
  }

  selectChapter(index: number): void {
    if (this.course) {
      this.selectedChapterIndex = index;
      this.currentChapter = this.course.chapters[index];
    }
  }

  previousChapter(): void {
    if (this.selectedChapterIndex > 0) {
      this.selectChapter(this.selectedChapterIndex - 1);
    }
  }

  nextChapter(): void {
    if (this.course && this.selectedChapterIndex < this.course.chapters.length - 1) {
      this.selectChapter(this.selectedChapterIndex + 1);
    }
  }

  markAsCompleted(): void {
    if (this.currentChapter && this.course) {
      if (!this.completedChapters.includes(this.currentChapter.id)) {
        this.completedChapters.push(this.currentChapter.id);
        this.courseService.updateProgress(this.course.id, this.currentChapter.id);
        this.calculateProgress();
      }
    }
  }

  isChapterCompleted(chapterId: string): boolean {
    return this.completedChapters.includes(chapterId);
  }

  takeQuiz(): void {
    if (this.currentChapter?.quiz && this.course) {
      this.router.navigate(['/quiz', this.course.id, this.currentChapter.id]);
    }
  }

  private calculateProgress(): void {
    if (this.course) {
      this.progressPercentage = Math.round(
        (this.completedChapters.length / this.course.chapters.length) * 100
      );
    }
  }
}