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
  selector: 'ui-textarea',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiTextareaComponent),
      multi: true,
    },
  ],
  template: `
    <label class="wrap">
      @if (label()) {
        <span class="label">{{ label() }}</span>
      }
      <textarea
        [attr.id]="textareaId()"
        class="field"
        [attr.placeholder]="placeholder() ?? null"
        [attr.rows]="rows()"
        [disabled]="isDisabled()"
        [value]="value()"
        (input)="onInput($event)"
        (blur)="onTouched()"
      ></textarea>
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
      padding: 0.6rem 0.75rem;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      resize: vertical;
      min-height: 6rem;
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
export class UiTextareaComponent implements ControlValueAccessor {
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly textareaId = input<string | undefined>(undefined);
  readonly rows = input(4);

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
    const v = (event.target as HTMLTextAreaElement).value;
    this.value.set(v);
    this.onChange(v);
  }
}
