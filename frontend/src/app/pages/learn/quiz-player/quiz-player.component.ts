import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService, Quiz, QuizResult, QuizSubmission } from '../../../core/services/quiz.service';

@Component({
    selector: 'app-quiz-player',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      @if (!quiz() && !loading()) {
        <div class="text-center text-gray-500 dark:text-gray-400 py-8">
          No quiz available for this lesson
        </div>
      }

      @if (loading()) {
        <div class="animate-pulse space-y-4">
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div class="space-y-3 mt-6">
            @for (i of [1,2,3,4]; track i) {
              <div class="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            }
          </div>
        </div>
      }

      @if (quiz() && !result() && !loading()) {
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ quiz()?.title }}</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ quiz()?.description }}</p>
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {{ quiz()?.totalQuestions }} questions • {{ quiz()?.passingScore }}% required to pass
          </div>

          <!-- Questions -->
          <div class="space-y-6">
            @for (question of quiz()?.questions || []; track question.id; let i = $index) {
              <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div class="font-medium text-gray-900 dark:text-white mb-3">
                  {{ i + 1 }}. {{ question.question }}
                </div>
                <div class="space-y-2">
                  @for (option of question.options; track option; let j = $index) {
                    <label class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                      [class]="answers()[question.id] === j ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'">
                      <input type="radio" [name]="question.id" [value]="j" 
                        (change)="selectAnswer(question.id, j)"
                        class="w-4 h-4 text-primary-600">
                      <span class="text-gray-900 dark:text-white">{{ option }}</span>
                    </label>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Submit Button -->
          <div class="mt-6">
            <button (click)="submitQuiz()" 
              [disabled]="!canSubmit()"
              class="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              Submit Quiz
            </button>
            <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              {{ Object.keys(answers()).length }} of {{ quiz()?.totalQuestions }} answered
            </p>
          </div>
        </div>
      }

      @if (result()) {
        <div class="text-center">
          <div class="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4"
            [class]="result()?.passed ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'">
            <span class="text-3xl font-bold">{{ result()?.scorePercentage }}%</span>
          </div>
          <h2 class="text-2xl font-bold mb-2" 
            [class]="result()?.passed ? 'text-green-600' : 'text-red-600'">
            {{ result()?.passed ? 'Congratulations!' : 'Keep Learning' }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            You got {{ result()?.correctAnswers }} out of {{ result()?.totalQuestions }} correct
          </p>

          <!-- Results Detail -->
          <div class="space-y-4 text-left mb-6">
            @for (qResult of result()?.results || []; track qResult.questionId; let i = $index) {
              <div class="border rounded-xl p-4" 
                [class]="qResult.correct ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'">
                <div class="flex items-start gap-2">
                  <span [class]="qResult.correct ? 'text-green-600' : 'text-red-600'" class="text-lg">
                    {{ qResult.correct ? '✓' : '✗' }}
                  </span>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ i + 1 }}. {{ qResult.question }}</p>
                    @if (qResult.explanation) {
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ qResult.explanation }}</p>
                    }
                  </div>
                </div>
              </div>
            }
          </div>

          <button (click)="retakeQuiz()" class="btn-secondary">
            Retake Quiz
          </button>
        </div>
      }
    </div>
  `
})
export class QuizPlayerComponent implements OnInit {
    @Input() lessonId!: string;

    private quizService = inject(QuizService);

    quiz = signal<Quiz | null>(null);
    result = signal<QuizResult | null>(null);
    loading = signal(true);
    answers = signal<Record<string, number>>({});
    Object = Object;

    ngOnInit(): void {
        this.loadQuiz();
    }

    private loadQuiz(): void {
        this.quizService.getQuizzesByLesson(this.lessonId).subscribe({
            next: (quizzes) => {
                if (quizzes.length > 0) {
                    this.quiz.set(quizzes[0]);
                }
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    selectAnswer(questionId: string, optionIndex: number): void {
        this.answers.update(current => ({ ...current, [questionId]: optionIndex }));
    }

    canSubmit(): boolean {
        return Object.keys(this.answers()).length === this.quiz()?.totalQuestions;
    }

    submitQuiz(): void {
        const quiz = this.quiz();
        if (!quiz) return;

        const submission: QuizSubmission = {
            answers: Object.entries(this.answers()).map(([questionId, selectedOptionIndex]) => ({
                questionId,
                selectedOptionIndex
            }))
        };

        this.quizService.submitQuiz(quiz.id, submission).subscribe({
            next: (result) => this.result.set(result),
            error: (err) => console.error('Error submitting quiz', err)
        });
    }

    retakeQuiz(): void {
        this.result.set(null);
        this.answers.set({});
    }
}
