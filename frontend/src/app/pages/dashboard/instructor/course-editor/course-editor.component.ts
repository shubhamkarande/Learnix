import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService, LessonService } from '../../../../core/services';
import { Course } from '../../../../core/models';

@Component({
    selector: 'app-course-editor',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule],
    template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <a routerLink="/instructor" class="text-primary-600 hover:text-primary-700 mb-2 inline-flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Dashboard
        </a>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEditing() ? 'Edit Course' : 'Create New Course' }}
        </h1>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <!-- Basic Info Card -->
        <div class="card p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

          <div class="space-y-4">
            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                Course Title *
              </label>
              <input
                id="title"
                type="text"
                formControlName="title"
                class="input"
                placeholder="e.g., Complete Web Development Bootcamp"
              >
            </div>

            <!-- Short Description -->
            <div>
              <label for="shortDescription" class="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <input
                id="shortDescription"
                type="text"
                formControlName="shortDescription"
                class="input"
                placeholder="A brief summary of your course"
                maxlength="200"
              >
              <p class="text-xs text-gray-500 mt-1">{{ form.get('shortDescription')?.value?.length || 0 }}/200</p>
            </div>

            <!-- Full Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                Full Description
              </label>
              <textarea
                id="description"
                formControlName="description"
                rows="6"
                class="input"
                placeholder="Describe what students will learn..."
              ></textarea>
            </div>

            <!-- Price & Category Row -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="price" class="block text-sm font-medium text-gray-700 mb-1">
                  Price (USD) *
                </label>
                <input
                  id="price"
                  type="number"
                  formControlName="price"
                  class="input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                >
              </div>
              <div>
                <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select formControlName="category" class="input">
                  <option value="">Select a category</option>
                  @for (cat of categories; track cat) {
                    <option [value]="cat">{{ cat }}</option>
                  }
                </select>
              </div>
            </div>

            <!-- Level & Language Row -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="level" class="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select formControlName="level" class="input">
                  <option value="">Select level</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
              <div>
                <label for="language" class="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <input
                  id="language"
                  type="text"
                  formControlName="language"
                  class="input"
                  placeholder="e.g., English"
                >
              </div>
            </div>

            <!-- Thumbnail URL -->
            <div>
              <label for="thumbnailUrl" class="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail URL
              </label>
              <input
                id="thumbnailUrl"
                type="url"
                formControlName="thumbnailUrl"
                class="input"
                placeholder="https://example.com/thumbnail.jpg"
              >
              <p class="text-xs text-gray-500 mt-1">Upload your image to Cloudinary and paste the URL</p>
            </div>
          </div>
        </div>

        <!-- Lessons Card -->
        <div class="card p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Lessons</h2>
            <button type="button" (click)="addLesson()" class="btn-secondary text-sm py-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Lesson
            </button>
          </div>

          @if (lessonsArray.length === 0) {
            <p class="text-gray-500 text-center py-8">No lessons yet. Add your first lesson above.</p>
          } @else {
            <div class="space-y-4" formArrayName="lessons">
              @for (lesson of lessonsArray.controls; track $index; let i = $index) {
                <div [formGroupName]="i" class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-start justify-between mb-3">
                    <span class="text-sm font-medium text-gray-500">Lesson {{ i + 1 }}</span>
                    <button type="button" (click)="removeLesson(i)" 
                      class="text-red-500 hover:text-red-600 text-sm">
                      Remove
                    </button>
                  </div>
                  
                  <div class="space-y-3">
                    <input
                      type="text"
                      formControlName="title"
                      class="input"
                      placeholder="Lesson title"
                    >
                    <input
                      type="url"
                      formControlName="videoUrl"
                      class="input"
                      placeholder="Video URL (Cloudinary)"
                    >
                    <div class="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        formControlName="durationSeconds"
                        class="input"
                        placeholder="Duration (seconds)"
                        min="0"
                      >
                      <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" formControlName="previewable" class="rounded">
                        <span class="text-sm text-gray-700">Free preview</span>
                      </label>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <input type="checkbox" formControlName="published" id="published" class="rounded">
            <label for="published" class="text-sm text-gray-700">Publish course</label>
          </div>
          
          <div class="flex gap-4">
            <a routerLink="/instructor" class="btn-secondary">Cancel</a>
            <button type="submit" [disabled]="form.invalid || saving()" class="btn-primary disabled:opacity-50">
              @if (saving()) {
                Saving...
              } @else {
                {{ isEditing() ? 'Update Course' : 'Create Course' }}
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  `
})
export class CourseEditorComponent implements OnInit {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private courseService = inject(CourseService);
    private lessonService = inject(LessonService);

    form!: FormGroup;
    isEditing = signal(false);
    saving = signal(false);
    courseId: string | null = null;

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
        this.initForm();
        this.courseId = this.route.snapshot.paramMap.get('id');

        if (this.courseId) {
            this.isEditing.set(true);
            this.loadCourse(this.courseId);
        }
    }

    private initForm(): void {
        this.form = this.fb.group({
            title: ['', Validators.required],
            shortDescription: [''],
            description: [''],
            price: [0, [Validators.required, Validators.min(0)]],
            category: [''],
            level: [''],
            language: ['English'],
            thumbnailUrl: [''],
            published: [false],
            lessons: this.fb.array([])
        });
    }

    private loadCourse(id: string): void {
        this.courseService.getCourseById(id).subscribe({
            next: (course) => {
                this.form.patchValue({
                    title: course.title,
                    shortDescription: course.shortDescription,
                    description: course.description,
                    price: course.price,
                    category: course.category,
                    level: course.level,
                    language: course.language,
                    thumbnailUrl: course.thumbnailUrl,
                    published: course.published
                });

                // Add existing lessons
                const allLessons = [
                    ...(course.modules?.flatMap(m => m.lessons) || []),
                    ...(course.lessons || [])
                ];
                allLessons.forEach(lesson => {
                    this.lessonsArray.push(this.fb.group({
                        id: [lesson.id],
                        title: [lesson.title, Validators.required],
                        videoUrl: [lesson.videoUrl],
                        durationSeconds: [lesson.durationSeconds],
                        orderIndex: [lesson.orderIndex],
                        previewable: [lesson.previewable]
                    }));
                });
            }
        });
    }

    get lessonsArray(): FormArray {
        return this.form.get('lessons') as FormArray;
    }

    addLesson(): void {
        this.lessonsArray.push(this.fb.group({
            title: ['', Validators.required],
            videoUrl: [''],
            durationSeconds: [0],
            orderIndex: [this.lessonsArray.length],
            previewable: [false]
        }));
    }

    removeLesson(index: number): void {
        this.lessonsArray.removeAt(index);
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        this.saving.set(true);
        const formValue = this.form.value;

        if (this.isEditing() && this.courseId) {
            // Update existing course
            this.courseService.updateCourse(this.courseId, formValue).subscribe({
                next: () => {
                    this.saving.set(false);
                    this.router.navigate(['/instructor']);
                },
                error: () => this.saving.set(false)
            });
        } else {
            // Create new course
            this.courseService.createCourse(formValue).subscribe({
                next: (course) => {
                    // Create lessons
                    const lessons = formValue.lessons;
                    if (lessons.length > 0) {
                        lessons.forEach((lesson: any, index: number) => {
                            this.lessonService.createLesson(course.id, {
                                ...lesson,
                                orderIndex: index
                            }).subscribe();
                        });
                    }

                    this.saving.set(false);
                    this.router.navigate(['/instructor']);
                },
                error: () => this.saving.set(false)
            });
        }
    }
}
