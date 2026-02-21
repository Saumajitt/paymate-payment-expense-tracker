import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnimatedCounterComponent } from '../../shared/components/animated-counter.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { ExpenseService } from '../../core/services/expense.service';
import { ExpenseResponse } from '../../core/models/expense.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AnimatedCounterComponent, StatusBadgeComponent, LoadingSpinnerComponent],
  template: `
    <div class="dashboard">
      <!-- Summary Cards -->
      <div class="summary-grid">
        <div class="summary-card glass-card animate-fade-in-up stagger-1">
          <div class="card-icon card-icon-expenses">
            <span class="material-icons">receipt_long</span>
          </div>
          <div class="card-body">
            <span class="card-label">Total Expenses</span>
            <app-animated-counter
              [targetValue]="totalExpenseAmount"
              prefix="$"
              [decimals]="2"
              [duration]="1200">
            </app-animated-counter>
          </div>
        </div>

        <div class="summary-card glass-card animate-fade-in-up stagger-2">
          <div class="card-icon card-icon-pending">
            <span class="material-icons">pending_actions</span>
          </div>
          <div class="card-body">
            <span class="card-label">Pending</span>
            <app-animated-counter
              [targetValue]="pendingCount"
              [duration]="800">
            </app-animated-counter>
          </div>
        </div>

        <div class="summary-card glass-card animate-fade-in-up stagger-3">
          <div class="card-icon card-icon-settled">
            <span class="material-icons">check_circle</span>
          </div>
          <div class="card-body">
            <span class="card-label">Settled</span>
            <app-animated-counter
              [targetValue]="settledCount"
              [duration]="800">
            </app-animated-counter>
          </div>
        </div>

        <div class="summary-card glass-card animate-fade-in-up stagger-4">
          <div class="card-icon card-icon-total">
            <span class="material-icons">trending_up</span>
          </div>
          <div class="card-body">
            <span class="card-label">All Entries</span>
            <app-animated-counter
              [targetValue]="expenses.length"
              [duration]="800">
            </app-animated-counter>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section animate-fade-in-up stagger-3">
        <h3 class="section-title">Quick Actions</h3>
        <div class="actions-grid">
          <a routerLink="/expenses/new" class="action-card glass-card">
            <span class="material-icons action-icon" style="color:#10b981">add_circle</span>
            <span class="action-label">New Expense</span>
          </a>
          <a routerLink="/payments" class="action-card glass-card">
            <span class="material-icons action-icon" style="color:#8b5cf6">send</span>
            <span class="action-label">Send Payment</span>
          </a>
          <a routerLink="/expenses" class="action-card glass-card">
            <span class="material-icons action-icon" style="color:#3b82f6">list_alt</span>
            <span class="action-label">View All</span>
          </a>
        </div>
      </div>

      <!-- Recent Expenses -->
      <div class="section animate-fade-in-up stagger-4">
        <div class="section-header">
          <h3 class="section-title">Recent Expenses</h3>
          <a routerLink="/expenses" class="view-all-link">View all →</a>
        </div>

        @if (loading) {
          <app-loading-spinner></app-loading-spinner>
        } @else if (expenses.length === 0) {
          <div class="empty-state glass-card">
            <span class="material-icons empty-icon">receipt_long</span>
            <h4>No expenses yet</h4>
            <p>Create your first expense to start tracking</p>
            <a routerLink="/expenses/new" class="empty-action">
              <span class="material-icons">add</span> Add Expense
            </a>
          </div>
        } @else {
          <div class="expense-list">
            @for (expense of recentExpenses; track expense.id) {
              <div class="expense-item glass-card">
                <div class="expense-icon">
                  <span class="material-icons">receipt</span>
                </div>
                <div class="expense-details">
                  <span class="expense-title">{{ expense.title }}</span>
                  <span class="expense-meta">
                    Paid by {{ expense.paidByName }}
                    @if (expense.groupName) {
                      · {{ expense.groupName }}
                    }
                  </span>
                </div>
                <div class="expense-right">
                  <span class="expense-amount">\${{ expense.totalAmount | number:'1.2-2' }}</span>
                  <app-status-badge [status]="expense.status"></app-status-badge>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
    }

    /* Summary Grid */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .summary-card {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .card-icon .material-icons { font-size: 24px; color: white; }
    .card-icon-expenses { background: linear-gradient(135deg, #10b981, #059669); }
    .card-icon-pending { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .card-icon-settled { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    .card-icon-total { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
    .card-body {
      display: flex;
      flex-direction: column;
    }
    .card-label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-bottom: 4px;
      font-weight: 500;
    }
    .card-body app-animated-counter {
      font-size: 1.5rem;
      color: var(--text-primary);
    }

    /* Section */
    .section {
      margin-bottom: 32px;
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .section-title {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 16px;
    }
    .section-header .section-title {
      margin-bottom: 0;
    }
    .view-all-link {
      font-size: 0.85rem;
      color: var(--accent-primary);
      font-weight: 500;
    }

    /* Quick Actions */
    .actions-grid {
      display: flex;
      gap: 16px;
    }
    .action-card {
      padding: 20px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      text-decoration: none;
    }
    .action-icon { font-size: 28px; }
    .action-label {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    /* Expense List */
    .expense-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .expense-item {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .expense-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(16, 185, 129, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .expense-icon .material-icons {
      color: var(--accent-primary);
      font-size: 20px;
    }
    .expense-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .expense-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .expense-meta {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .expense-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
    }
    .expense-amount {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 48px 24px;
    }
    .empty-icon {
      font-size: 48px;
      color: var(--text-muted);
      margin-bottom: 16px;
    }
    .empty-state h4 {
      font-size: 1.1rem;
      margin-bottom: 8px;
    }
    .empty-state p {
      color: var(--text-secondary);
      font-size: 0.85rem;
      margin-bottom: 20px;
    }
    .empty-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 20px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 10px;
    }
    .empty-action:hover {
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
      color: white;
    }

    @media (max-width: 768px) {
      .summary-grid { grid-template-columns: repeat(2, 1fr); }
      .actions-grid { flex-direction: column; }
    }
    @media (max-width: 480px) {
      .summary-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  expenses: ExpenseResponse[] = [];
  loading = true;

  constructor(private expenseService: ExpenseService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.expenseService.getMyExpenses().subscribe({
      next: (data: ExpenseResponse[]) => {
        this.expenses = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  get recentExpenses(): ExpenseResponse[] {
    return this.expenses.slice(0, 5);
  }

  get totalExpenseAmount(): number {
    return this.expenses.reduce((sum, e) => sum + e.totalAmount, 0);
  }

  get pendingCount(): number {
    return this.expenses.filter(e => e.status === 'PENDING' || e.status === 'PARTIALLY_SETTLED').length;
  }

  get settledCount(): number {
    return this.expenses.filter(e => e.status === 'SETTLED').length;
  }
}
