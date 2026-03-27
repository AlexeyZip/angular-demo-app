export interface SseEvent {
  id: number;
  level: 'info' | 'warning';
  message: string;
  at: string;
}

export interface WsMetric {
  source: 'websocket';
  sequence: number;
  throughput: number;
  at: string;
}
