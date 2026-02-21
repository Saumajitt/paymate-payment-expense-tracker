import { Component } from '@angular/core';

@Component({
    selector: 'app-loading-spinner',
    standalone: true,
    template: `
    <div class="spinner-overlay">
      <div class="spinner">
        <div class="spinner-ring"></div>
        <span class="spinner-text">PayMate</span>
      </div>
    </div>
  `,
    styles: [`
    .spinner-overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px;
    }
    .spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .spinner-ring {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(148, 163, 184, 0.15);
      border-top-color: #10b981;
      border-radius: 50%;
      animation: spin 0.8s ease-in-out infinite;
    }
    .spinner-text {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent { }
