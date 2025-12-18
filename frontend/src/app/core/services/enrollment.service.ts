import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Enrollment, ProgressUpdate } from '../models';

@Injectable({
    providedIn: 'root'
})
export class EnrollmentService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    enrollInCourse(courseId: string): Observable<Enrollment> {
        return this.http.post<Enrollment>(`${this.apiUrl}/courses/${courseId}/enroll`, {});
    }

    getMyEnrollments(): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(`${this.apiUrl}/enrollments`);
    }

    getInProgressEnrollments(limit = 5): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(`${this.apiUrl}/enrollments/in-progress`, {
            params: { limit: limit.toString() }
        });
    }

    getCompletedEnrollments(): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(`${this.apiUrl}/enrollments/completed`);
    }

    updateLessonProgress(lessonId: string, progress: ProgressUpdate): Observable<Enrollment> {
        return this.http.put<Enrollment>(`${this.apiUrl}/lessons/${lessonId}/progress`, progress);
    }

    markLessonComplete(lessonId: string): Observable<Enrollment> {
        return this.http.post<Enrollment>(`${this.apiUrl}/lessons/${lessonId}/complete`, {});
    }
}
