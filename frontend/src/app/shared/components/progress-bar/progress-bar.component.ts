import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-progress-bar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="progress-bar" [class]="sizeClass">
      <div class="progress-bar-fill" [style.width.%]="progress"></div>
    </div>
    @if (showLabel) {
      <span class="text-sm text-gray-500 mt-1">{{ progress }}% complete</span>
    }
  `
})
export class ProgressBarComponent {
    @Input() progress: number = 0;
    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() showLabel: boolean = false;

    get sizeClass(): string {
        const sizes = {
            'sm': 'h-1',
            'md': 'h-2',
            'lg': 'h-3'
        };
        return sizes[this.size] || 'h-2';
    }
}
