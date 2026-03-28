import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, input } from '@angular/core';

@Component({
  selector: 'ui-template-list',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './ui-template-list.component.html',
  styleUrl: './ui-template-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTemplateListComponent {
  readonly items = input<readonly unknown[]>([]);
  readonly itemTemplate = input.required<TemplateRef<{ $implicit: unknown; index: number }>>();
  readonly emptyTemplate = input<TemplateRef<unknown> | null>(null);
  readonly trackBy = input<(index: number, item: unknown) => unknown>((index) => index);
}
