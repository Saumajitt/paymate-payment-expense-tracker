import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="auth-page">
      <div class="auth-bg">
        <div class="bg-orb orb-1"></div>
        <div class="bg-orb orb-2"></div>
        <div class="bg-orb orb-3"></div>
      </div>

      <div class="auth-card glass">
        <!-- Logo -->
        <div class="auth-logo">
          <div class="logo-icon">
            <span class="material-icons">account_balance_wallet</span>
          </div>
          <h1 class="text-gradient">PayMate</h1>
          <p class="auth-subtitle">Sign in to manage your expenses</p>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onLogin()" class="auth-form">
          <mat-form-field appearance="outline">
            <mat-label>Email address</mat-label>
            <input matInput type="email" [(ngModel)]="email" name="email" required
                   placeholder="you@example.com">
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'"
                   [(ngModel)]="password" name="password" required>
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix type="button"
                    (click)="hidePassword = !hidePassword">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          @if (errorMessage) {
            <div class="error-message">
              <span class="material-icons">error_outline</span>
              {{ errorMessage }}
            </div>
          }

          <button mat-flat-button class="auth-submit-btn" type="submit" [disabled]="loading">
            @if (loading) {
              <span class="spinner-sm"></span>
            } @else {
              Sign In
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/signup">Create one</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }
    /* Animated background orbs */
    .auth-bg {
      position: fixed;
      inset: 0;
      z-index: 0;
    }
    .bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: float 8s ease-in-out infinite;
    }
    .orb-1 {
      width: 400px; height: 400px;
      background: #10b981;
      top: -10%; left: -5%;
      animation-delay: 0s;
    }
    .orb-2 {
      width: 350px; height: 350px;
      background: #8b5cf6;
      bottom: -10%; right: -5%;
      animation-delay: -3s;
    }
    .orb-3 {
      width: 250px; height: 250px;
      background: #3b82f6;
      top: 50%; left: 60%;
      animation-delay: -5s;
    }
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -20px) scale(1.05); }
      66% { transform: translate(-20px, 20px) scale(0.95); }
    }

    /* Card */
    .auth-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 440px;
      padding: 48px 40px;
      animation: fadeInUp 0.6s ease;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Logo */
    .auth-logo {
      text-align: center;
      margin-bottom: 36px;
    }
    .auth-logo .logo-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, #10b981, #8b5cf6);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .auth-logo .logo-icon .material-icons {
      color: white;
      font-size: 28px;
    }
    .auth-logo h1 {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .auth-subtitle {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    /* Form */
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    /* Material field overrides */
    :host ::ng-deep .mat-mdc-form-field {
      width: 100%;
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
    :host ::ng-deep .mat-mdc-form-field-icon-prefix .mat-icon,
    :host ::ng-deep .mat-mdc-form-field-icon-suffix .mat-icon {
      color: var(--text-muted) !important;
    }

    /* Submit */
    .auth-submit-btn {
      width: 100%;
      height: 48px;
      background: linear-gradient(135deg, #10b981, #059669) !important;
      color: white !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      border-radius: 10px !important;
      margin-top: 12px;
      transition: all var(--transition-base);
    }
    .auth-submit-btn:hover:not(:disabled) {
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
      transform: translateY(-1px);
    }
    .auth-submit-btn:disabled {
      opacity: 0.6;
    }

    /* Error */
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
    .error-message .material-icons {
      font-size: 18px;
    }

    /* Spinner */
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

    /* Footer */
    .auth-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .auth-footer a {
      color: var(--accent-primary);
      font-weight: 600;
    }
    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  hidePassword = true;
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) { }

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).pipe(
      timeout(15000),
      catchError((err: any) => throwError(() => err))
    ).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.loading = false;
        if (err.name === 'TimeoutError') {
          this.errorMessage = 'Request timed out. Please check if the server is running.';
        } else if (err.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please ensure the backend is running on port 8081.';
        } else {
          this.errorMessage = err.error?.message || 'Invalid email or password. Please try again.';
        }
        this.cdr.markForCheck();
      }
    });
  }
}
