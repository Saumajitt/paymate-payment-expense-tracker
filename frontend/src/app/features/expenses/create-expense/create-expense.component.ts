import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseService } from '../../../core/services/expense.service';
import { SplitType } from '../../../core/models/expense.models';

@Component({
    selector: 'app-create-expense',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
    template: `
    <div class="create-expense-page">
      <div class="page-header animate-fade-in-up">
        <a routerLink="/expenses" class="back-link">
          <span class="material-icons">arrow_back</span> Back
        </a>
        <h1 class="page-title">Create Expense</h1>
        <p class="page-subtitle">Split an expense with your group</p>
      </div>

      <div class="form-container glass animate-fade-in-up stagger-2">
        <form (ngSubmit)="onSubmit()" class="expense-form">
          <!-- Title & Description -->
          <div class="form-section">
            <h3 class="form-section-title">
              <span class="material-icons">edit</span>
              Details
            </h3>
            <mat-form-field appearance="outline">
              <mat-label>Expense title</mat-label>
              <input matInput [(ngModel)]="form.title" name="title" required
                     placeholder="e.g. Dinner at Joe's">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Description (optional)</mat-label>
              <textarea matInput [(ngModel)]="form.description" name="description"
                        rows="2" placeholder="Add any notes..."></textarea>
            </mat-form-field>
          </div>

          <!-- Amount & Split -->
          <div class="form-section">
            <h3 class="form-section-title">
              <span class="material-icons">calculate</span>
              Amount & Split
            </h3>
            <mat-form-field appearance="outline">
              <mat-label>Total Amount ($)</mat-label>
              <input matInput type="number" [(ngModel)]="form.totalAmount" name="totalAmount"
                     required min="0.01" step="0.01" placeholder="0.00">
              <span matPrefix class="dollar-prefix">$&nbsp;</span>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Split Type</mat-label>
              <mat-select [(ngModel)]="form.splitType" name="splitType">
                <mat-option value="EQUAL">Equal Split</mat-option>
                <mat-option value="PERCENTAGE">Percentage</mat-option>
                <mat-option value="EXACT_AMOUNT">Exact Amounts</mat-option>
                <mat-option value="SHARES">Shares</mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Split preview -->
            @if (form.totalAmount && form.splitType === 'EQUAL' && participantCount > 0) {
              <div class="split-preview">
                <span class="material-icons">info</span>
                Each person pays <strong>\${{ perPersonAmount }}</strong>
              </div>
            }
          </div>

          <!-- Participants -->
          <div class="form-section">
            <h3 class="form-section-title">
              <span class="material-icons">people</span>
              Participants
            </h3>
            <mat-form-field appearance="outline">
              <mat-label>Participant IDs (comma separated)</mat-label>
              <input matInput [(ngModel)]="participantInput" name="participants"
                     required placeholder="e.g. 1, 2, 3">
              <mat-hint>Enter the user IDs of participants</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Group ID (optional)</mat-label>
              <input matInput type="number" [(ngModel)]="form.groupId" name="groupId"
                     placeholder="Leave empty for non-group expense">
            </mat-form-field>
          </div>

          @if (errorMessage) {
            <div class="error-message">
              <span class="material-icons">error_outline</span>
              {{ errorMessage }}
            </div>
          }

          @if (successMessage) {
            <div class="success-message">
              <span class="material-icons">check_circle</span>
              {{ successMessage }}
            </div>
          }

          <div class="form-actions">
            <a routerLink="/expenses" class="cancel-btn">Cancel</a>
            <button mat-flat-button class="submit-btn" type="submit" [disabled]="loading">
              @if (loading) {
                <span class="spinner-sm"></span>
              } @else {
                <span class="material-icons">add_circle</span>
                Create Expense
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .create-expense-page {
      max-width: 680px;
    }
    .page-header {
      margin-bottom: 24px;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: var(--text-secondary);
      font-size: 0.85rem;
      margin-bottom: 12px;
    }
    .back-link:hover { color: var(--text-primary); }
    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
    }
    .page-subtitle {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-top: 4px;
    }

    .form-container {
      padding: 32px;
    }
    .expense-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .form-section {
      margin-bottom: 12px;
    }
    .form-section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 16px;
    }
    .form-section-title .material-icons {
      font-size: 20px;
      color: var(--accent-primary);
    }

    :host ::ng-deep .mdc-text-field--outlined {
      background: rgba(15, 23, 42, 0.5) !important;
      border-radius: 10px !important;
    }
    :host ::ng-deep .mdc-notched-outline__leading,
    :host ::ng-deep .mdc-notched-outline__notch,
    :host ::ng-deep .mdc-notched-outline__trailing {
      border-color: var(--border-subtle) !important;
    }
    :host ::ng-deep .mat-mdc-form-field-focus-overlay {
      background: transparent !important;
    }
    :host ::ng-deep .mdc-text-field--focused .mdc-notched-outline__leading,
    :host ::ng-deep .mdc-text-field--focused .mdc-notched-outline__notch,
    :host ::ng-deep .mdc-text-field--focused .mdc-notched-outline__trailing {
      border-color: var(--accent-primary) !important;
    }
    :host ::ng-deep .mat-mdc-input-element {
      color: var(--text-primary) !important;
    }
    :host ::ng-deep .mat-mdc-floating-label {
      color: var(--text-secondary) !important;
    }
    :host ::ng-deep .mat-mdc-select-value {
      color: var(--text-primary) !important;
    }
    :host ::ng-deep .mat-mdc-form-field-hint {
      color: var(--text-muted) !important;
    }

    .dollar-prefix {
      color: var(--text-muted);
      font-weight: 500;
    }

    .split-preview {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.15);
      border-radius: 8px;
      color: var(--accent-primary-light);
      font-size: 0.85rem;
    }
    .split-preview .material-icons {
      font-size: 18px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid var(--border-subtle);
    }
    .cancel-btn {
      padding: 10px 24px;
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 500;
    }
    .cancel-btn:hover { color: var(--text-primary); }
    .submit-btn {
      display: inline-flex !important;
      align-items: center;
      gap: 8px;
      padding: 12px 28px !important;
      background: linear-gradient(135deg, #10b981, #059669) !important;
      color: white !important;
      font-size: 0.9rem !important;
      font-weight: 600 !important;
      border-radius: 10px !important;
    }
    .submit-btn:hover:not(:disabled) {
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
    }
    .submit-btn .material-icons { font-size: 20px; }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 8px;
      color: #f87171;
      font-size: 0.85rem;
    }
    .success-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 8px;
      color: #34d399;
      font-size: 0.85rem;
    }
    .error-message .material-icons,
    .success-message .material-icons { font-size: 18px; }

    .spinner-sm {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .form-container { padding: 20px; }
    }
  `]
})
export class CreateExpenseComponent {
    form: {
        title: string;
        description: string;
        totalAmount: number | null;
        splitType: SplitType;
        groupId: number | null;
    } = {
            title: '',
            description: '',
            totalAmount: null,
            splitType: 'EQUAL',
            groupId: null
        };
    participantInput = '';
    loading = false;
    errorMessage = '';
    successMessage = '';

    constructor(private expenseService: ExpenseService, private router: Router) { }

    get participantCount(): number {
        return this.parseParticipantIds().length;
    }

    get perPersonAmount(): string {
        if (this.form.totalAmount && this.participantCount > 0) {
            return (this.form.totalAmount / this.participantCount).toFixed(2);
        }
        return '0.00';
    }

    private parseParticipantIds(): number[] {
        return this.participantInput
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !isNaN(Number(s)))
            .map(Number);
    }

    onSubmit() {
        const participantIds = this.parseParticipantIds();
        if (!this.form.title || !this.form.totalAmount || participantIds.length === 0) {
            this.errorMessage = 'Please fill in title, amount, and at least one participant.';
            return;
        }

        this.loading = true;
        this.errorMessage = '';
        this.successMessage = '';

        this.expenseService.createExpense({
            title: this.form.title,
            description: this.form.description || undefined,
            totalAmount: this.form.totalAmount,
            splitType: this.form.splitType,
            participantIds,
            groupId: this.form.groupId || undefined
        }).subscribe({
            next: () => {
                this.successMessage = 'Expense created successfully!';
                this.loading = false;
                setTimeout(() => this.router.navigate(['/expenses']), 1500);
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = err.error || 'Failed to create expense. Please try again.';
            }
        });
    }
}
