export interface PollingSnapshotDto {
  source: 'polling';
  sequence: number;
  cpuPercent: number;
  queueDepth: number;
  generatedAt: string;
}
