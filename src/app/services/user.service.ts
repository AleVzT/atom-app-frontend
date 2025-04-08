import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { UserStoreService } from './user-store.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private userStore = inject(UserStoreService);
  private router = inject(Router)
  private baseUrl = 'https://api-65aqrsu3vq-uc.a.run.app/users';

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
