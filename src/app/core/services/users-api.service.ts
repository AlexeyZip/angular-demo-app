import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../tokens/api-base-url.token';
import { UserDto } from './interfaces/users.interfaces';
export * from './interfaces/users.interfaces';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string,
  ) {}

  getAll(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.baseUrl}/users`);
  }
}
