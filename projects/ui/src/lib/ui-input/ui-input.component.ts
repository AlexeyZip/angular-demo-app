import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputComponent),
      multi: true,
    },
  ],
  template: `
    <label class="wrap">
      @if (label()) {
        <span class="label">{{ label() }}</span>
      }
      <input
        [attr.id]="inputId()"
        class="field"
        [attr.placeholder]="placeholder() ?? null"
        [attr.type]="type()"
        [disabled]="isDisabled()"
        [value]="value()"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
    </label>
  `,
  styles: `
    :host {
      display: block;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font: inherit;
    }
    .label {
      font-size: 0.875rem;
      color: #475569;
    }
    .field {
      font: inherit;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      outline: none;
    }
    .field:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }
    .field:disabled {
      background: #f1f5f9;
      color: #64748b;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiInputComponent implements ControlValueAccessor {
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly type = input<'text' | 'search' | 'email' | 'password'>('text');
  readonly inputId = input<string | undefined>(undefined);

  protected readonly value = signal('');
  protected readonly isDisabled = signal(false);

  private onChange: (v: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
    this.cdr.markForCheck();
  }

  protected onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChange(v);
  }
}
