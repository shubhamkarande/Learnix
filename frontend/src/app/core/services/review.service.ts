import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from './admin.service';

export interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        avatarUrl: string;
    };
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
}

export interface ReviewRequest {
    rating: number;
    comment?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getCourseReviews(courseId: string, page = 0, size = 10): Observable<PageResponse<Review>> {
        return this.http.get<PageResponse<Review>>(`${this.apiUrl}/courses/${courseId}/reviews`, {
            params: { page: page.toString(), size: size.toString() }
        });
    }

    getReviewStats(courseId: string): Observable<ReviewStats> {
        return this.http.get<ReviewStats>(`${this.apiUrl}/courses/${courseId}/reviews/stats`);
    }

    createOrUpdateReview(courseId: string, request: ReviewRequest): Observable<Review> {
        return this.http.post<Review>(`${this.apiUrl}/courses/${courseId}/reviews`, request);
    }

    deleteReview(courseId: string, reviewId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/courses/${courseId}/reviews/${reviewId}`);
    }
}
