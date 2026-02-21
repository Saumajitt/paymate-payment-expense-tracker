import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { NavbarComponent } from './navbar.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, SidebarComponent, NavbarComponent],
    template: `
    <div class="app-shell">
      <app-sidebar></app-sidebar>
      <main class="main-content">
        <app-navbar></app-navbar>
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .app-shell {
      display: flex;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
      margin-left: var(--sidebar-width);
      transition: margin-left var(--transition-slow);
      display: flex;
      flex-direction: column;
    }
    .page-content {
      flex: 1;
      padding: 8px 32px 32px;
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
      }
      .page-content {
        padding: 8px 16px 16px;
      }
    }
  `]
})
export class LayoutComponent { }
