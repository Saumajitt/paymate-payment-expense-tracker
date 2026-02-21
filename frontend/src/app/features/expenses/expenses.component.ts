import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { ExpenseService } from '../../core/services/expense.service';
import { ExpenseResponse } from '../../core/models/expense.models';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatButtonModule, MatIconModule, StatusBadgeComponent, LoadingSpinnerComponent],
  template: `
    <div class="expenses-page">
      <!-- Header -->
      <div class="page-header animate-fade-in-up">
        <div>
          <h1 class="page-title">Expenses</h1>
          <p class="page-subtitle">Track and manage all your shared expenses</p>
        </div>
        <a routerLink="/expenses/new" class="create-btn">
          <span class="material-icons">add</span>
          New Expense
        </a>
      </div>

      <!-- Filters -->
      <div class="filters-bar glass-card animate-fade-in-up stagger-1">
        <div class="search-filter">
          <span class="material-icons">search</span>
          <input type="text" placeholder="Search expenses..." [(ngModel)]="searchQuery">
        </div>
        <div class="status-filters">
          <button class="filter-chip" [class.active]="filterStatus === 'ALL'"
                  (click)="filterStatus = 'ALL'">All</button>
          <button class="filter-chip" [class.active]="filterStatus === 'PENDING'"
                  (click)="filterStatus = 'PENDING'">Pending</button>
          <button class="filter-chip" [class.active]="filterStatus === 'SETTLED'"
                  (click)="filterStatus = 'SETTLED'">Settled</button>
        </div>
      </div>

      <!-- List -->
      @if (loading) {
        <app-loading-spinner></app-loading-spinner>
      } @else if (filteredExpenses.length === 0) {
        <div class="empty-state glass-card animate-fade-in-up">
          <span class="material-icons empty-icon">receipt_long</span>
          <h4>No expenses found</h4>
          <p>
            @if (searchQuery || filterStatus !== 'ALL') {
              Try adjusting your search or filters
            } @else {
              Create your first expense to get started
            }
          </p>
        </div>
      } @else {
        <div class="expense-grid">
          @for (expense of filteredExpenses; track expense.id; let i = $index) {
            <div class="expense-card glass-card animate-fade-in-up"
                 [style.animation-delay.ms]="i * 50">
              <div class="card-header">
                <div class="card-title-section">
                  <h3 class="card-title">{{ expense.title }}</h3>
                  @if (expense.description) {
                    <p class="card-desc">{{ expense.description }}</p>
                  }
                </div>
                <app-status-badge [status]="expense.status"></app-status-badge>
              </div>

              <div class="card-details">
                <div class="detail-row">
                  <span class="detail-label">
                    <span class="material-icons">person</span>
                    Paid by
                  </span>
                  <span class="detail-value">{{ expense.paidByName }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">
                    <span class="material-icons">category</span>
                    Split Type
                  </span>
                  <span class="detail-value split-tag">{{ expense.splitType | titlecase }}</span>
                </div>
                @if (expense.groupName) {
                  <div class="detail-row">
                    <span class="detail-label">
                      <span class="material-icons">group</span>
                      Group
                    </span>
                    <span class="detail-value">{{ expense.groupName }}</span>
                  </div>
                }
              </div>

              <div class="card-footer">
                <span class="card-amount">\${{ expense.totalAmount | number:'1.2-2' }}</span>
                @if (expense.status !== 'SETTLED') {
                  <button class="settle-btn" (click)="settleExpense(expense)">
                    <span class="material-icons">check</span> Settle
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .expenses-page {
      max-width: 1200px;
    }
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 24px;
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
    .create-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
      border-radius: 12px;
      text-decoration: none;
      transition: all var(--transition-base);
    }
    .create-btn:hover {
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
      transform: translateY(-1px);
      color: white;
    }
    .create-btn .material-icons { font-size: 20px; }

    /* Filters */
    .filters-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      margin-bottom: 24px;
      gap: 16px;
    }
    .search-filter {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      max-width: 320px;
    }
    .search-filter .material-icons {
      color: var(--text-muted);
      font-size: 20px;
    }
    .search-filter input {
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-size: 0.85rem;
      font-family: inherit;
      width: 100%;
    }
    .search-filter input::placeholder { color: var(--text-muted); }
    .status-filters {
      display: flex;
      gap: 8px;
    }
    .filter-chip {
      padding: 6px 16px;
      border-radius: 999px;
      border: 1px solid var(--border-subtle);
      background: transparent;
      color: var(--text-secondary);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      font-family: inherit;
    }
    .filter-chip:hover {
      border-color: var(--border-medium);
      color: var(--text-primary);
    }
    .filter-chip.active {
      background: rgba(16, 185, 129, 0.15);
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }

    /* Expense Grid */
    .expense-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 16px;
    }
    .expense-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }
    .card-title {
      font-size: 1rem;
      font-weight: 600;
    }
    .card-desc {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: 4px;
    }
    .card-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .detail-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .detail-label .material-icons {
      font-size: 16px;
    }
    .detail-value {
      font-size: 0.85rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    .split-tag {
      padding: 2px 8px;
      background: rgba(139, 92, 246, 0.1);
      border-radius: 4px;
      color: var(--accent-secondary-light);
      font-size: 0.75rem;
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid var(--border-subtle);
    }
    .card-amount {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .settle-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 16px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 8px;
      color: var(--accent-primary);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all var(--transition-fast);
    }
    .settle-btn:hover {
      background: rgba(16, 185, 129, 0.25);
    }
    .settle-btn .material-icons {
      font-size: 16px;
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
    }

    @media (max-width: 768px) {
      .page-header { flex-direction: column; gap: 16px; }
      .filters-bar { flex-direction: column; align-items: stretch; }
      .expense-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ExpensesComponent implements OnInit {
  expenses: ExpenseResponse[] = [];
  loading = true;
  searchQuery = '';
  filterStatus = 'ALL';

  constructor(private expenseService: ExpenseService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    this.loading = true;
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

  get filteredExpenses(): ExpenseResponse[] {
    let result = this.expenses;

    if (this.filterStatus !== 'ALL') {
      result = result.filter(e => e.status === this.filterStatus);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.paidByName?.toLowerCase().includes(q) ||
        e.groupName?.toLowerCase().includes(q)
      );
    }
    return result;
  }

  settleExpense(expense: ExpenseResponse) {
    this.expenseService.settleExpense(expense.id).subscribe({
      next: () => {
        expense.status = 'SETTLED';
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      }
    });
  }
}
