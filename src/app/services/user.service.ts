import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { UserStoreService } from './user-store.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private userStore: UserStoreService,
    private router: Router
  ) {}
  private baseUrl = `${environment.baseUrl}/users`;

  login(email: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, { email }).pipe(
      tap((user) => this.userStore.setUser(user))
    );
  }

  register(email: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}`, { email }).pipe(
      tap((user) => this.userStore.setUser(user))
    );
  }

  logout(): void {
    this.userStore.clearUser();
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.userStore.user();
  }

  isAuthenticated(): boolean {
    return this.userStore.isAuthenticated();
  }
}
