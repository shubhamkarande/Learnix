import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CheckoutResponse {
    sessionId: string;
    checkoutUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    createCheckoutSession(courseId: string, successUrl?: string, cancelUrl?: string): Observable<CheckoutResponse> {
        return this.http.post<CheckoutResponse>(`${this.apiUrl}/payments/create-checkout`, {
            courseId,
            successUrl,
            cancelUrl
        });
    }

    hasUserPurchasedCourse(courseId: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/payments/check/${courseId}`);
    }

    redirectToCheckout(checkoutUrl: string): void {
        window.location.href = checkoutUrl;
    }
}
