import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminStats {
    totalUsers: number;
    totalStudents: number;
    totalInstructors: number;
    totalCourses: number;
    publishedCourses: number;
    totalEnrollments: number;
    completedEnrollments: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
    avatarUrl: string;
    createdAt: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getStats(): Observable<AdminStats> {
        return this.http.get<AdminStats>(`${this.apiUrl}/admin/stats`);
    }

    getUsers(page = 0, size = 20): Observable<PageResponse<User>> {
        return this.http.get<PageResponse<User>>(`${this.apiUrl}/admin/users`, {
            params: { page: page.toString(), size: size.toString() }
        });
    }

    getCourses(page = 0, size = 20): Observable<PageResponse<any>> {
        return this.http.get<PageResponse<any>>(`${this.apiUrl}/admin/courses`, {
            params: { page: page.toString(), size: size.toString() }
        });
    }

    updateUserRole(userId: string, role: string): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/admin/users/${userId}/role`, { role });
    }

    approveCourse(courseId: string, approved: boolean): Observable<any> {
        return this.http.patch<any>(`${this.apiUrl}/admin/courses/${courseId}/approve`, null, {
            params: { approved: approved.toString() }
        });
    }

    deleteUser(userId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/admin/users/${userId}`);
    }

    deleteCourse(courseId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/admin/courses/${courseId}`);
    }
}
