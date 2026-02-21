import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-animated-counter',
    standalone: true,
    template: `
    <span class="counter">{{ prefix }}{{ displayValue }}{{ suffix }}</span>
  `,
    styles: [`
    .counter {
      font-variant-numeric: tabular-nums;
      font-weight: 700;
    }
  `]
})
export class AnimatedCounterComponent implements OnInit, OnChanges {
    @Input() targetValue: number = 0;
    @Input() duration: number = 1000;
    @Input() prefix: string = '';
    @Input() suffix: string = '';
    @Input() decimals: number = 0;

    displayValue: string = '0';

    ngOnInit() { this.animateValue(); }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['targetValue']) { this.animateValue(); }
    }

    private animateValue() {
        const start = 0;
        const end = this.targetValue;
        const startTime = performance.now();

        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = start + (end - start) * eased;
            this.displayValue = current.toFixed(this.decimals);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }
}
