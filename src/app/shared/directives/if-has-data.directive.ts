import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';

@Directive({
  selector: '[appIfHasData]',
  standalone: true,
})
export class IfHasDataDirective<T = unknown> {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  private elseTemplate: TemplateRef<unknown> | null = null;
  private currentValue: T[] | null | undefined;

  @Input()
  set appIfHasData(value: T[] | null | undefined) {
    this.currentValue = value;
    this.render();
  }

  @Input()
  set appIfHasDataElse(templateRef: TemplateRef<unknown> | null) {
    this.elseTemplate = templateRef;
    this.render();
  }

  private render(): void {
    this.viewContainer.clear();
    const hasData = Array.isArray(this.currentValue) && this.currentValue.length > 0;
    if (hasData) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }
    if (this.elseTemplate) {
      this.viewContainer.createEmbeddedView(this.elseTemplate);
    }
  }
}
