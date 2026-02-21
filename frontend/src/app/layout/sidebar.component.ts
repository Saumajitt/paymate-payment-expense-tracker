import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <!-- Logo Section -->
      <div class="sidebar-logo">
        <div class="logo-icon">
          <span class="material-icons">account_balance_wallet</span>
        </div>
        @if (!collapsed) {
          <span class="logo-text text-gradient">PayMate</span>
        }
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <span class="material-icons">dashboard</span>
          @if (!collapsed) {
            <span class="nav-label">Dashboard</span>
          }
        </a>
        <a routerLink="/expenses" routerLinkActive="active" class="nav-item">
          <span class="material-icons">receipt_long</span>
          @if (!collapsed) {
            <span class="nav-label">Expenses</span>
          }
        </a>
        <a routerLink="/payments" routerLinkActive="active" class="nav-item">
          <span class="material-icons">payments</span>
          @if (!collapsed) {
            <span class="nav-label">Payments</span>
          }
        </a>
      </nav>

      <!-- Collapse Toggle -->
      <button class="collapse-btn" (click)="collapsed = !collapsed">
        <span class="material-icons">
          {{ collapsed ? 'chevron_right' : 'chevron_left' }}
        </span>
      </button>

      <!-- User Section -->
      <div class="sidebar-user">
        <div class="user-avatar">
          {{ userInitials }}
        </div>
        @if (!collapsed) {
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="user-email">{{ userEmail }}</span>
          </div>
          <button class="logout-btn" (click)="logout()" title="Sign Out">
            <span class="material-icons">logout</span>
          </button>
        }
      </div>
    </aside>
  `,
    styles: [`
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: var(--sidebar-width);
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-right: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
      padding: 24px 16px;
      transition: width var(--transition-slow);
      z-index: 100;
      overflow: hidden;
    }
    .sidebar.collapsed {
      width: var(--sidebar-collapsed-width);
      padding: 24px 10px;
    }

    /* Logo */
    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 8px;
      margin-bottom: 40px;
      white-space: nowrap;
    }
    .logo-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #10b981, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .logo-icon .material-icons {
      color: white;
      font-size: 22px;
    }
    .logo-text {
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 14px;
      border-radius: 10px;
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 500;
      transition: all var(--transition-base);
      cursor: pointer;
      text-decoration: none;
      white-space: nowrap;
    }
    .nav-item:hover {
      background: rgba(148, 163, 184, 0.08);
      color: var(--text-primary);
    }
    .nav-item.active {
      background: rgba(16, 185, 129, 0.12);
      color: var(--accent-primary);
    }
    .nav-item.active .material-icons {
      color: var(--accent-primary);
    }
    .nav-item .material-icons {
      font-size: 22px;
      flex-shrink: 0;
    }

    /* Collapse toggle */
    .collapse-btn {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 8px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      border-radius: 8px;
      margin-bottom: 12px;
      transition: all var(--transition-fast);
    }
    .collapse-btn:hover {
      background: rgba(148, 163, 184, 0.08);
      color: var(--text-secondary);
    }

    /* User section */
    .sidebar-user {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 8px;
      border-top: 1px solid var(--border-subtle);
      white-space: nowrap;
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #8b5cf6, #10b981);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }
    .user-info {
      flex: 1;
      min-width: 0;
    }
    .user-name {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-email {
      display: block;
      font-size: 0.7rem;
      color: var(--text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .logout-btn {
      border: none;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      padding: 6px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      transition: all var(--transition-fast);
    }
    .logout-btn:hover {
      color: var(--accent-danger);
      background: rgba(239, 68, 68, 0.1);
    }
    .logout-btn .material-icons {
      font-size: 20px;
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }
      .sidebar.show-mobile {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent {
    collapsed = false;

    constructor(private authService: AuthService) { }

    get userName(): string {
        const user = this.authService.getCurrentUser();
        return user ? `${user.firstName} ${user.lastName}` : 'User';
    }

    get userEmail(): string {
        return this.authService.getCurrentUser()?.email || '';
    }

    get userInitials(): string {
        const user = this.authService.getCurrentUser();
        if (user) {
            return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
        }
        return 'U';
    }

    logout() {
        this.authService.logout();
    }
}
