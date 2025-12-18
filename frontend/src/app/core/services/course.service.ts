import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course, CourseRequest, PageResponse, Lesson } from '../models';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getCourses(page = 0, size = 12, sortBy = 'createdAt', sortDir = 'desc'): Observable<PageResponse<Course>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sortBy', sortBy)
            .set('sortDir', sortDir);

        return this.http.get<PageResponse<Course>>(`${this.apiUrl}/courses`, { params });
    }

    searchCourses(query: string, page = 0, size = 12): Observable<PageResponse<Course>> {
        const params = new HttpParams()
            .set('query', query)
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PageResponse<Course>>(`${this.apiUrl}/courses/search`, { params });
    }

    getCoursesByCategory(category: string, page = 0, size = 12): Observable<PageResponse<Course>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PageResponse<Course>>(`${this.apiUrl}/courses/category/${category}`, { params });
    }

    getTopCourses(limit = 6): Observable<Course[]> {
        return this.http.get<Course[]>(`${this.apiUrl}/courses/top`, {
            params: { limit: limit.toString() }
        });
    }

    getNewCourses(limit = 6): Observable<Course[]> {
        return this.http.get<Course[]>(`${this.apiUrl}/courses/new`, {
            params: { limit: limit.toString() }
        });
    }

    getCourseById(id: string): Observable<Course> {
        return this.http.get<Course>(`${this.apiUrl}/courses/${id}`);
    }

    getPreviewLessons(courseId: string): Observable<Lesson[]> {
        return this.http.get<Lesson[]>(`${this.apiUrl}/courses/${courseId}/lessons/preview`);
    }

    // Instructor methods
    getInstructorCourses(): Observable<Course[]> {
        return this.http.get<Course[]>(`${this.apiUrl}/instructor/courses`);
    }

    createCourse(request: CourseRequest): Observable<Course> {
        return this.http.post<Course>(`${this.apiUrl}/courses`, request);
    }

    updateCourse(id: string, request: CourseRequest): Observable<Course> {
        return this.http.put<Course>(`${this.apiUrl}/courses/${id}`, request);
    }

    deleteCourse(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/courses/${id}`);
    }

    publishCourse(id: string, publish: boolean): Observable<Course> {
        return this.http.patch<Course>(`${this.apiUrl}/courses/${id}/publish`, null, {
            params: { publish: publish.toString() }
        });
    }
}
