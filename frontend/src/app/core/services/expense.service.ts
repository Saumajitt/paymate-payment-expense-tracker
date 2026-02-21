import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../config/api.config';
import { CreateExpenseRequest, ExpenseResponse } from '../models/expense.models';

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {
    private readonly API_URL = `${environment.apiBaseUrl}/api/expenses`;

    constructor(private http: HttpClient) { }

    createExpense(request: CreateExpenseRequest): Observable<ExpenseResponse> {
        return this.http.post<ExpenseResponse>(this.API_URL, request);
    }

    getMyExpenses(): Observable<ExpenseResponse[]> {
        return this.http.get<ExpenseResponse[]>(`${this.API_URL}/my-expenses`);
    }

    getGroupExpenses(groupId: number): Observable<ExpenseResponse[]> {
        return this.http.get<ExpenseResponse[]>(`${this.API_URL}/group/${groupId}`);
    }

    settleExpense(expenseId: number): Observable<string> {
        return this.http.post(`${this.API_URL}/${expenseId}/settle`, {}, { responseType: 'text' });
    }
}
