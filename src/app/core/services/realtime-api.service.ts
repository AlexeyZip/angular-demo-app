import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PollingSnapshotDto } from './interfaces/realtime.interfaces';
export * from './interfaces/realtime.interfaces';

@Injectable({ providedIn: 'root' })
export class RealtimeApiService {
  constructor(private readonly http: HttpClient) {}

  getPollingSnapshot(): Observable<PollingSnapshotDto> {
    return this.http.get<PollingSnapshotDto>('/api/realtime/poll');
  }
}
