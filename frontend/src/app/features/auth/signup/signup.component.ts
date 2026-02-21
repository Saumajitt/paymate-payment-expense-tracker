import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { timeout, catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../core/config/api.config';

@Component({
  selector: 'app-signup',
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
        <div class="auth-logo">
          <div class="logo-icon">
            <span class="material-icons">account_balance_wallet</span>
          </div>
          <h1 class="text-gradient">Join PayMate</h1>
          <p class="auth-subtitle">Create your account and start splitting</p>
        </div>

        @if (successMessage) {
          <div class="success-message animate-fade-in-up">
            <span class="material-icons">check_circle</span>
            <div>
              <strong>Account created!</strong>
              <p>{{ successMessage }}</p>
            </div>
          </div>
          <div class="auth-footer" style="margin-top:24px">
            <a routerLink="/login" class="back-to-login">Go to Sign In →</a>
          </div>
        } @else {
          <form (ngSubmit)="onSignup()" class="auth-form">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput [(ngModel)]="form.firstName" name="firstName" required>
                <mat-icon matPrefix>person</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput [(ngModel)]="form.lastName" name="lastName" required>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Email address</mat-label>
              <input matInput type="email" [(ngModel)]="form.email" name="email" required
                     placeholder="you@example.com">
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Phone Number</mat-label>
              <input matInput [(ngModel)]="form.phoneNumber" name="phoneNumber" required
                     placeholder="+1234567890">
              <mat-icon matPrefix>phone</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'"
                     [(ngModel)]="form.password" name="password" required minlength="6">
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button"
                      (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <!-- Password strength indicator -->
            @if (form.password) {
              <div class="password-strength">
                <div class="strength-bars">
                  <div class="bar" [class.active]="passwordStrength >= 1"
                       [style.background]="strengthColor"></div>
                  <div class="bar" [class.active]="passwordStrength >= 2"
                       [style.background]="strengthColor"></div>
                  <div class="bar" [class.active]="passwordStrength >= 3"
                       [style.background]="strengthColor"></div>
                  <div class="bar" [class.active]="passwordStrength >= 4"
                       [style.background]="strengthColor"></div>
                </div>
                <span class="strength-label" [style.color]="strengthColor">{{ strengthLabel }}</span>
              </div>
            }

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
                Create Account
              }
            </button>
          </form>

          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/login">Sign in</a></p>
          </div>
        }
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
      background: #8b5cf6;
      top: -10%; right: -5%;
      animation-delay: 0s;
    }
    .orb-2 {
      width: 350px; height: 350px;
      background: #10b981;
      bottom: -10%; left: -5%;
      animation-delay: -3s;
    }
    .orb-3 {
      width: 250px; height: 250px;
      background: #f59e0b;
      top: 40%; left: 30%;
      animation-delay: -5s;
    }
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -20px) scale(1.05); }
      66% { transform: translate(-20px, 20px) scale(0.95); }
    }

    .auth-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 500px;
      padding: 44px 40px;
      animation: fadeInUp 0.6s ease;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .auth-logo {
      text-align: center;
      margin-bottom: 32px;
    }
    .auth-logo .logo-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, #8b5cf6, #10b981);
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
      font-size: 1.6rem;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .auth-subtitle {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .form-row {
      display: flex;
      gap: 12px;
    }
    .form-row mat-form-field {
      flex: 1;
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
    :host ::ng-deep .mat-mdc-form-field-icon-prefix .mat-icon,
    :host ::ng-deep .mat-mdc-form-field-icon-suffix .mat-icon {
      color: var(--text-muted) !important;
    }

    .password-strength {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    .strength-bars {
      display: flex;
      gap: 4px;
      flex: 1;
    }
    .bar {
      height: 4px;
      flex: 1;
      border-radius: 2px;
      background: var(--bg-tertiary);
      transition: background var(--transition-base);
    }
    .bar.active {
      background: currentColor;
    }
    .strength-label {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .auth-submit-btn {
      width: 100%;
      height: 48px;
      background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
      color: white !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      border-radius: 10px !important;
      margin-top: 12px;
      transition: all var(--transition-base);
    }
    .auth-submit-btn:hover:not(:disabled) {
      box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
      transform: translateY(-1px);
    }
    .auth-submit-btn:disabled {
      opacity: 0.6;
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
    .error-message .material-icons { font-size: 18px; }

    .success-message {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 12px;
      color: #34d399;
    }
    .success-message .material-icons {
      font-size: 24px;
      margin-top: 2px;
    }
    .success-message strong {
      display: block;
      margin-bottom: 4px;
      font-size: 1rem;
    }
    .success-message p {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .back-to-login {
      color: var(--accent-primary) !important;
      font-weight: 600;
      font-size: 0.9rem;
    }

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

    .auth-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .auth-footer a {
      color: var(--accent-secondary);
      font-weight: 600;
    }
    .auth-footer a:hover { text-decoration: underline; }

    @media (max-width: 480px) {
      .form-row { flex-direction: column; gap: 4px; }
      .auth-card { padding: 32px 24px; }
    }
  `]
})
export class SignupComponent {
  form = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  };
  hidePassword = true;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) { }

  get passwordStrength(): number {
    const p = this.form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p) || /[^a-zA-Z0-9]/.test(p)) score++;
    return score;
  }

  get strengthColor(): string {
    switch (this.passwordStrength) {
      case 1: return '#ef4444';
      case 2: return '#f59e0b';
      case 3: return '#3b82f6';
      case 4: return '#10b981';
      default: return '#64748b';
    }
  }

  get strengthLabel(): string {
    switch (this.passwordStrength) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  }

  onSignup() {
    if (!this.form.firstName || !this.form.lastName || !this.form.email ||
      !this.form.phoneNumber || !this.form.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    if (this.form.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.signup(this.form).pipe(
      timeout(15000),
      catchError((err: any) => throwError(() => err))
    ).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = (response as any).message || 'You can now sign in with your credentials.';
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.loading = false;
        if (err.name === 'TimeoutError') {
          this.errorMessage = 'Request timed out. Please check if the server is running.';
        } else if (err.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please ensure the backend is running on port 8081.';
        } else {
          this.errorMessage = err.error?.message || (typeof err.error === 'string' ? err.error : 'Registration failed. Please try again.');
        }
        this.cdr.markForCheck();
      }
    });
  }
}
