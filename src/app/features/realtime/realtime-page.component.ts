import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { I18nPipe } from '../../core/i18n/i18n.pipe';
import { RealtimeApiService, PollingSnapshotDto } from '../../core/services/realtime-api.service';
import { interval, startWith, switchMap } from 'rxjs';
import { SseEvent, WsMetric } from './interfaces/realtime-stream.interfaces';

@Component({
  selector: 'app-realtime-page',
  standalone: true,
  imports: [DatePipe, I18nPipe],
  templateUrl: './realtime-page.component.html',
  styleUrl: './realtime-page.component.scss',
})
export class RealtimePageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly realtimeApi = inject(RealtimeApiService);

  readonly polling = signal<PollingSnapshotDto | null>(null);
  readonly sseEvents = signal<SseEvent[]>([]);
  readonly wsMetrics = signal<WsMetric[]>([]);
  readonly wsStatus = signal<'connecting' | 'open' | 'closed'>('connecting');

  constructor() {
    interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.realtimeApi.getPollingSnapshot()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((snapshot) => this.polling.set(snapshot));

    const eventSource = new EventSource('/api/realtime/events');
    eventSource.addEventListener('telemetry', (event) => {
      const parsed = JSON.parse((event as MessageEvent<string>).data) as SseEvent;
      this.sseEvents.update((items) => [parsed, ...items].slice(0, 8));
    });
    this.destroyRef.onDestroy(() => eventSource.close());

    const socket = new WebSocket(
      `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/metrics`,
    );
    socket.onopen = () => this.wsStatus.set('open');
    socket.onclose = () => this.wsStatus.set('closed');
    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data) as WsMetric;
      this.wsMetrics.update((items) => [payload, ...items].slice(0, 8));
    };
    this.destroyRef.onDestroy(() => socket.close());
  }
}
