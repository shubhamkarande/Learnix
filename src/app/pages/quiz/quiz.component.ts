import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Course, Chapter, Quiz, Question } from '../../models/course.model';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="quiz" class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{quiz.title}}</h1>
              <p class="text-gray-600">Course: {{course?.title}}</p>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-500">Question {{currentQuestionIndex + 1}} of {{quiz.questions.length}}</div>
              <div class="text-sm text-gray-500">Passing Score: {{quiz.passingScore}}%</div>
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div class="mt-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                   [style.width.%]="progressPercentage"></div>
            </div>
          </div>
        </div>

        <!-- Quiz Content -->
        <div *ngIf="!showResults" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              {{currentQuestion.question}}
            </h2>
            
            <div class="space-y-3">
              <label *ngFor="let option of currentQuestion.options; let i = index" 
                     class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                     [class.border-primary-500]="selectedAnswer === i"
                     [class.bg-primary-50]="selectedAnswer === i">
                <input 
                  type="radio" 
                  [value]="i" 
                  [(ngModel)]="selectedAnswer"
                  name="answer"
                  class="mr-3"
                >
                <span class="text-gray-900">{{option}}</span>
              </label>
            </div>
          </div>

          <div class="flex justify-between">
            <button 
              (click)="previousQuestion()"
              [disabled]="currentQuestionIndex === 0"
              class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button 
              (click)="nextQuestion()"
              [disabled]="selectedAnswer === null"
              class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="currentQuestionIndex < quiz.questions.length - 1">Next</span>
              <span *ngIf="currentQuestionIndex === quiz.questions.length - 1">Submit Quiz</span>
            </button>
          </div>
        </div>

        <!-- Results -->
        <div *ngIf="showResults" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="text-center mb-8">
            <div [class.text-green-600]="score >= quiz.passingScore" 
                 [class.text-red-600]="score < quiz.passingScore"
                 class="text-4xl font-bold mb-2">
              {{score}}%
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              <span *ngIf="score >= quiz.passingScore">Congratulations! You passed!</span>
              <span *ngIf="score < quiz.passingScore">You didn't pass this time</span>
            </h2>
            <p class="text-gray-600">
              You got {{correctAnswers}} out of {{quiz.questions.length}} questions correct.
            </p>
          </div>

          <!-- Question Review -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900">Review Your Answers</h3>
            <div *ngFor="let question of quiz.questions; let i = index" class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-start justify-between mb-3">
                <h4 class="font-medium text-gray-900">{{i + 1}}. {{question.question}}</h4>
                <span [class.text-green-600]="userAnswers[i] === question.correctAnswer"
                      [class.text-red-600]="userAnswers[i] !== question.correctAnswer"
                      class="font-medium">
                  <span *ngIf="userAnswers[i] === question.correctAnswer">✓ Correct</span>
                  <span *ngIf="userAnswers[i] !== question.correctAnswer">✗ Incorrect</span>
                </span>
              </div>
              
              <div class="space-y-2">
                <div *ngFor="let option of question.options; let j = index" 
                     class="p-2 rounded text-sm"
                     [class.bg-green-100]="j === question.correctAnswer"
                     [class.bg-red-100]="j === userAnswers[i] && j !== question.correctAnswer"
                     [class.text-green-800]="j === question.correctAnswer"
                     [class.text-red-800]="j === userAnswers[i] && j !== question.correctAnswer">
                  <span class="font-medium">
                    <span *ngIf="j === question.correctAnswer">✓ </span>
                    <span *ngIf="j === userAnswers[i] && j !== question.correctAnswer">✗ </span>
                  </span>
                  {{option}}
                </div>
              </div>
              
              <div *ngIf="question.explanation" class="mt-3 p-3 bg-blue-50 rounded text-sm text-blue-800">
                <strong>Explanation:</strong> {{question.explanation}}
              </div>
            </div>
          </div>

          <div class="flex justify-center space-x-4 mt-8">
            <button (click)="retakeQuiz()" class="btn-secondary">Retake Quiz</button>
            <button (click)="backToCourse()" class="btn-primary">Back to Course</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class QuizComponent implements OnInit {
  course: Course | null = null;
  chapter: Chapter | null = null;
  quiz: Quiz | null = null;
  currentQuestionIndex = 0;
  selectedAnswer: number | null = null;
  userAnswers: number[] = [];
  showResults = false;
  score = 0;
  correctAnswers = 0;

  get currentQuestion(): Question {
    return this.quiz!.questions[this.currentQuestionIndex];
  }

  get progressPercentage(): number {
    if (!this.quiz) return 0;
    return ((this.currentQuestionIndex + 1) / this.quiz.questions.length) * 100;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    const chapterId = this.route.snapshot.paramMap.get('chapterId');

    if (courseId && chapterId) {
      this.courseService.getCourse(courseId).subscribe(course => {
        if (course) {
          this.course = course;
          this.chapter = course.chapters.find(c => c.id === chapterId) || null;
          this.quiz = this.chapter?.quiz || null;
          
          if (this.quiz) {
            this.userAnswers = new Array(this.quiz.questions.length).fill(-1);
          }
        }
      });
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.saveCurrentAnswer();
      this.currentQuestionIndex--;
      this.loadAnswerForQuestion();
    }
  }

  nextQuestion(): void {
    if (!this.quiz) return;

    this.saveCurrentAnswer();

    if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
      this.loadAnswerForQuestion();
    } else {
      this.submitQuiz();
    }
  }

  private saveCurrentAnswer(): void {
    if (this.selectedAnswer !== null) {
      this.userAnswers[this.currentQuestionIndex] = this.selectedAnswer;
    }
  }

  private loadAnswerForQuestion(): void {
    const savedAnswer = this.userAnswers[this.currentQuestionIndex];
    this.selectedAnswer = savedAnswer >= 0 ? savedAnswer : null;
  }

  private submitQuiz(): void {
    if (!this.quiz) return;

    // Calculate score
    this.correctAnswers = 0;
    this.quiz.questions.forEach((question, index) => {
      if (this.userAnswers[index] === question.correctAnswer) {
        this.correctAnswers++;
      }
    });

    this.score = Math.round((this.correctAnswers / this.quiz.questions.length) * 100);
    this.showResults = true;
  }

  retakeQuiz(): void {
    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.userAnswers = new Array(this.quiz!.questions.length).fill(-1);
    this.showResults = false;
    this.score = 0;
    this.correctAnswers = 0;
  }

  backToCourse(): void {
    if (this.course) {
      this.router.navigate(['/learn', this.course.id]);
    }
  }
}