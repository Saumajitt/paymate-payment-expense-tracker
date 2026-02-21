import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-status-badge',
    standalone: true,
    imports: [CommonModule],
    template: `
    <span class="badge" [ngClass]="statusClass">
      <span class="badge-dot"></span>
      {{ label }}
    </span>
  `,
    styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    .badge-pending {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
    }
    .badge-pending .badge-dot {
      background: #fbbf24;
      box-shadow: 0 0 6px rgba(251, 191, 36, 0.5);
    }
    .badge-settled {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
    }
    .badge-settled .badge-dot {
      background: #34d399;
      box-shadow: 0 0 6px rgba(52, 211, 153, 0.5);
    }
    .badge-partial {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
    }
    .badge-partial .badge-dot {
      background: #60a5fa;
      box-shadow: 0 0 6px rgba(96, 165, 250, 0.5);
    }
    .badge-failed {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
    }
    .badge-failed .badge-dot {
      background: #f87171;
      box-shadow: 0 0 6px rgba(248, 113, 113, 0.5);
    }
    .badge-processing {
      background: rgba(139, 92, 246, 0.15);
      color: #a78bfa;
    }
    .badge-processing .badge-dot {
      background: #a78bfa;
      box-shadow: 0 0 6px rgba(167, 139, 250, 0.5);
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `]
})
export class StatusBadgeComponent {
    @Input() status: string = '';

    get statusClass(): string {
        switch (this.status?.toUpperCase()) {
            case 'PENDING': return 'badge-pending';
            case 'SETTLED':
            case 'COMPLETED': return 'badge-settled';
            case 'PARTIALLY_SETTLED': return 'badge-partial';
            case 'FAILED':
            case 'CANCELLED': return 'badge-failed';
            case 'PROCESSING': return 'badge-processing';
            default: return 'badge-pending';
        }
    }

    get label(): string {
        return this.status?.replace(/_/g, ' ') || 'UNKNOWN';
    }
}
