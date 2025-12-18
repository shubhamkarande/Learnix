import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lesson } from '../models';

export interface LessonRequest {
    title: string;
    description?: string;
    videoUrl?: string;
    videoPublicId?: string;
    durationSeconds?: number;
    orderIndex: number;
    previewable?: boolean;
    resourceUrl?: string;
    resourceName?: string;
}

@Injectable({
    providedIn: 'root'
})
export class LessonService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    createLesson(courseId: string, request: LessonRequest): Observable<Lesson> {
        return this.http.post<Lesson>(`${this.apiUrl}/courses/${courseId}/lessons`, request);
    }

    createLessonInModule(courseId: string, moduleId: string, request: LessonRequest): Observable<Lesson> {
        return this.http.post<Lesson>(`${this.apiUrl}/courses/${courseId}/modules/${moduleId}/lessons`, request);
    }

    updateLesson(lessonId: string, request: LessonRequest): Observable<Lesson> {
        return this.http.put<Lesson>(`${this.apiUrl}/lessons/${lessonId}`, request);
    }

    deleteLesson(lessonId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/lessons/${lessonId}`);
    }

    getLesson(lessonId: string): Observable<Lesson> {
        return this.http.get<Lesson>(`${this.apiUrl}/lessons/${lessonId}`);
    }
}
