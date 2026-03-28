import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-surface',
  standalone: true,
  templateUrl: './ui-surface.component.html',
  styleUrl: './ui-surface.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSurfaceComponent {}
