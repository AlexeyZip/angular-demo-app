import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type UiButtonVariant = 'primary' | 'secondary' | 'ghost';

@Component({
  selector: 'ui-button',
  standalone: true,
  template: `
    <button
      [attr.type]="type()"
      [attr.aria-label]="ariaLabel() || null"
      [disabled]="disabled()"
      [class]="hostClass()"
      (click)="clicked.emit($event)"
    >
      <ng-content />
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
    }
    button {
      font: inherit;
      cursor: pointer;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      border: 1px solid transparent;
      transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    }
    button:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .primary {
      background: #2563eb;
      color: #fff;
    }
    .primary:hover:not(:disabled) {
      background: #1d4ed8;
    }
    .secondary {
      background: #f1f5f9;
      color: #0f172a;
      border-color: #cbd5e1;
    }
    .secondary:hover:not(:disabled) {
      background: #e2e8f0;
    }
    .ghost {
      background: transparent;
      color: #334155;
      border-color: transparent;
    }
    .ghost:hover:not(:disabled) {
      background: #f8fafc;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
  readonly variant = input<UiButtonVariant>('primary');
  readonly disabled = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string>('');

  readonly clicked = output<MouseEvent>();

  protected hostClass(): string {
    return this.variant();
  }
}
