import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  @Input('appTooltip') text = '';
  @Input() appTooltipDelay = 120;

  private bubble: HTMLElement | null = null;
  private showTimer: ReturnType<typeof setTimeout> | null = null;

  @HostListener('mouseenter')
  @HostListener('focusin')
  onEnter(): void {
    if (!this.text?.trim()) {
      return;
    }
    this.clearTimer();
    this.showTimer = setTimeout(() => this.show(), this.appTooltipDelay);
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  onLeave(): void {
    this.clearTimer();
    this.hide();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.hide();
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.hide();
  }

  private show(): void {
    this.hide();

    const el = this.host.nativeElement;
    const rect = el.getBoundingClientRect();
    const bubble = this.renderer.createElement('div') as HTMLElement;
    bubble.textContent = this.text;

    this.renderer.setStyle(bubble, 'position', 'fixed');
    this.renderer.setStyle(bubble, 'z-index', '1200');
    this.renderer.setStyle(bubble, 'max-width', '320px');
    this.renderer.setStyle(bubble, 'padding', '0.35rem 0.5rem');
    this.renderer.setStyle(bubble, 'border-radius', '6px');
    this.renderer.setStyle(bubble, 'font-size', '12px');
    this.renderer.setStyle(bubble, 'line-height', '1.35');
    this.renderer.setStyle(bubble, 'background', '#0f172a');
    this.renderer.setStyle(bubble, 'color', '#f8fafc');
    this.renderer.setStyle(bubble, 'box-shadow', '0 4px 14px rgba(2,6,23,.25)');
    this.renderer.setStyle(bubble, 'left', `${Math.max(8, rect.left)}px`);
    this.renderer.setStyle(bubble, 'top', `${Math.max(8, rect.top - 36)}px`);
    this.renderer.appendChild(document.body, bubble);
    this.bubble = bubble;
  }

  private hide(): void {
    if (!this.bubble) {
      return;
    }
    this.renderer.removeChild(document.body, this.bubble);
    this.bubble = null;
  }

  private clearTimer(): void {
    if (!this.showTimer) {
      return;
    }
    clearTimeout(this.showTimer);
    this.showTimer = null;
  }
}
