import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <header class="navbar">
      <div class="navbar-left">
        <h2 class="page-title">{{ greeting }}</h2>
      </div>
      <div class="navbar-right">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input type="text" placeholder="Search expenses, payments..." />
        </div>
        <button class="icon-btn" title="Notifications">
          <span class="material-icons">notifications_none</span>
          <span class="notification-badge"></span>
        </button>
      </div>
    </header>
  `,
    styles: [`
    .navbar {
      height: var(--navbar-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      background: transparent;
    }
    .page-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    .navbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-full);
      padding: 8px 16px;
      transition: all var(--transition-base);
    }
    .search-box:focus-within {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
    .search-box .material-icons {
      color: var(--text-muted);
      font-size: 20px;
    }
    .search-box input {
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-size: 0.85rem;
      font-family: inherit;
      width: 220px;
    }
    .search-box input::placeholder {
      color: var(--text-muted);
    }
    .icon-btn {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: 1px solid var(--border-subtle);
      background: var(--bg-card);
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-base);
    }
    .icon-btn:hover {
      border-color: var(--border-medium);
      color: var(--text-primary);
      background: var(--bg-card-hover);
    }
    .notification-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-primary);
      box-shadow: 0 0 6px rgba(16, 185, 129, 0.5);
    }
    @media (max-width: 768px) {
      .navbar { padding: 0 16px; }
      .search-box { display: none; }
    }
  `]
})
export class NavbarComponent {
    constructor(private authService: AuthService) { }

    get greeting(): string {
        const user = this.authService.getCurrentUser();
        const hour = new Date().getHours();
        let timeGreeting = 'Good evening';
        if (hour < 12) timeGreeting = 'Good morning';
        else if (hour < 17) timeGreeting = 'Good afternoon';

        return user ? `${timeGreeting}, ${user.firstName}` : timeGreeting;
    }
}
