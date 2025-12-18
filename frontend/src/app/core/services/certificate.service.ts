import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Certificate {
    id: string;
    certificateNumber: string;
    issuedAt: string;
    pdfUrl: string;
    course: {
        id: string;
        title: string;
        thumbnailUrl: string;
    };
    user: {
        id: string;
        name: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class CertificateService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getUserCertificates(): Observable<Certificate[]> {
        return this.http.get<Certificate[]>(`${this.apiUrl}/certificates`);
    }

    getCertificate(certificateId: string): Observable<Certificate> {
        return this.http.get<Certificate>(`${this.apiUrl}/certificates/${certificateId}`);
    }

    verifyCertificate(certificateNumber: string): Observable<Certificate> {
        return this.http.get<Certificate>(`${this.apiUrl}/certificates/verify/${certificateNumber}`);
    }

    issueCertificate(courseId: string): Observable<Certificate> {
        return this.http.post<Certificate>(`${this.apiUrl}/certificates/issue/${courseId}`, {});
    }
}
