import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PaymentService } from '../../core/services/payment.service';
import { PaymentResponse } from '../../core/models/payment.models';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="payments-page">
      <div class="page-header animate-fade-in-up">
        <h1 class="page-title">Payments</h1>
        <p class="page-subtitle">Send payments and manage transactions</p>
      </div>

      <div class="payments-layout">
        <!-- Send Payment Form -->
        <div class="payment-form-card glass animate-fade-in-up stagger-1">
          <div class="form-header">
            <div class="form-header-icon">
              <span class="material-icons">send</span>
            </div>
            <h3>Send Payment</h3>
          </div>

          <form (ngSubmit)="onSubmit()" class="payment-form">
            <mat-form-field appearance="outline">
              <mat-label>Amount ($)</mat-label>
              <input matInput type="number" [(ngModel)]="form.amount" name="amount"
                     required min="0.01" step="0.01" placeholder="0.00">
              <span matPrefix class="dollar-prefix">$&nbsp;</span>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Recipient User ID</mat-label>
              <input matInput type="number" [(ngModel)]="form.receiverId" name="receiverId"
                     placeholder="Enter user ID">
              <mat-icon matPrefix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Description (optional)</mat-label>
              <input matInput [(ngModel)]="form.description" name="description"
                     placeholder="What's this payment for?">
              <mat-icon matPrefix>notes</mat-icon>
            </mat-form-field>

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

            <button mat-flat-button class="submit-btn" type="submit" [disabled]="loading">
              @if (loading) {
                <span class="spinner-sm"></span>
              } @else {
                <span class="material-icons">send</span>
                Send Payment
              }
            </button>
          </form>
        </div>

        <!-- Info Cards -->
        <div class="info-section animate-fade-in-up stagger-2">
          <div class="info-card glass-card">
            <span class="material-icons info-icon" style="color:#10b981">shield</span>
            <h4>Secure Payments</h4>
            <p>All payments are processed through Stripe with industry-standard encryption</p>
          </div>

          <div class="info-card glass-card">
            <span class="material-icons info-icon" style="color:#8b5cf6">speed</span>
            <h4>Instant Transfers</h4>
            <p>Payments are processed in real-time with webhook-based verification</p>
          </div>

          <div class="info-card glass-card">
            <span class="material-icons info-icon" style="color:#f59e0b">history</span>
            <h4>Full History</h4>
            <p>Every transaction is tracked with complete audit trail</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payments-page {
      max-width: 1200px;
    }
    .page-header {
      margin-bottom: 32px;
    }
    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
    }
    .page-subtitle {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-top: 4px;
    }

    .payments-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      align-items: start;
    }

    /* Form Card */
    .payment-form-card {
      padding: 32px;
    }
    .form-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 28px;
    }
    .form-header-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .form-header-icon .material-icons {
      color: white;
      font-size: 22px;
    }
    .form-header h3 {
      font-size: 1.15rem;
      font-weight: 600;
    }
    .payment-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
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
      border-color: var(--accent-secondary) !important;
    }
    :host ::ng-deep .mat-mdc-input-element {
      color: var(--text-primary) !important;
    }
    :host ::ng-deep .mat-mdc-floating-label {
      color: var(--text-secondary) !important;
    }
    :host ::ng-deep .mat-mdc-form-field-icon-prefix .mat-icon {
      color: var(--text-muted) !important;
    }

    .dollar-prefix {
      color: var(--text-muted);
      font-weight: 500;
    }

    .submit-btn {
      width: 100%;
      height: 48px;
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
      color: white !important;
      font-size: 0.95rem !important;
      font-weight: 600 !important;
      border-radius: 10px !important;
      margin-top: 12px;
    }
    .submit-btn:hover:not(:disabled) {
      box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
    }
    .submit-btn .material-icons { font-size: 20px; }

    /* Info Section */
    .info-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .info-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .info-icon {
      font-size: 32px;
      margin-bottom: 4px;
    }
    .info-card h4 {
      font-size: 0.95rem;
      font-weight: 600;
    }
    .info-card p {
      font-size: 0.8rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

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
      .payments-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class PaymentsComponent {
  form = {
    amount: null as number | null,
    receiverId: null as number | null,
    description: ''
  };
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private paymentService: PaymentService, private cdr: ChangeDetectorRef) { }

  onSubmit() {
    if (!this.form.amount || this.form.amount <= 0) {
      this.errorMessage = 'Please enter a valid amount.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.paymentService.createPaymentIntent({
      amount: this.form.amount,
      receiverId: this.form.receiverId || undefined,
      description: this.form.description || undefined
    }).subscribe({
      next: (response: PaymentResponse) => {
        this.loading = false;
        this.successMessage = response.message || 'Payment intent created successfully!';
        this.form = { amount: null, receiverId: null, description: '' };
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = typeof err.error === 'string' ? err.error : 'Payment failed. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }
}
