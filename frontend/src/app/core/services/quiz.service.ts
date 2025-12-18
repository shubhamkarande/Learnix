import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Quiz {
    id: string;
    lessonId: string;
    title: string;
    description: string;
    passingScore: number;
    totalQuestions: number;
    questions: QuizQuestion[];
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    orderIndex: number;
}

export interface QuizSubmission {
    answers: { questionId: string; selectedOptionIndex: number }[];
}

export interface QuizResult {
    quizId: string;
    totalQuestions: number;
    correctAnswers: number;
    scorePercentage: number;
    passed: boolean;
    passingScore: number;
    results: QuestionResult[];
}

export interface QuestionResult {
    questionId: string;
    question: string;
    selectedOptionIndex: number;
    correctOptionIndex: number;
    correct: boolean;
    explanation: string;
}

@Injectable({
    providedIn: 'root'
})
export class QuizService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getQuizzesByLesson(lessonId: string): Observable<Quiz[]> {
        return this.http.get<Quiz[]>(`${this.apiUrl}/lessons/${lessonId}/quizzes`);
    }

    getQuiz(quizId: string): Observable<Quiz> {
        return this.http.get<Quiz>(`${this.apiUrl}/quizzes/${quizId}`);
    }

    submitQuiz(quizId: string, submission: QuizSubmission): Observable<QuizResult> {
        return this.http.post<QuizResult>(`${this.apiUrl}/quizzes/${quizId}/submit`, submission);
    }
}
