import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="label">{{ label }}</div>
      <div class="value">{{ value }}</div>
      <div class="hint">{{ hint }}</div>
    </div>
  `,
  styles: [`
    .label { color: var(--muted); font-size: 14px; margin-bottom: 6px; }
    .value { font-size: 30px; font-weight: 800; margin-bottom: 8px; }
    .hint { color: var(--muted); font-size: 13px; }
  `]
})
export class StatCardComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) value: string | number = 0;
  @Input() hint = '';
}
