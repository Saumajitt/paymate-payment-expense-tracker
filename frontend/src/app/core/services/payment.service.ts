import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../config/api.config';
import { PaymentRequest, PaymentResponse } from '../models/payment.models';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private readonly API_URL = `${environment.apiBaseUrl}/api/payments`;

    constructor(private http: HttpClient) { }

    createPaymentIntent(request: PaymentRequest): Observable<PaymentResponse> {
        return this.http.post<PaymentResponse>(`${this.API_URL}/create-payment-intent`, request);
    }
}
