import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private _user = signal<User | null>(this.getUserFromLocalStorage());

  readonly user = computed(() => this._user());
  readonly isAuthenticated = computed(() => !!this._user()?.token);

  setUser(user: User): void {
    this._user.set(user);
    localStorage.setItem('token', user.token);
    localStorage.setItem('email', user.email);
  }

  clearUser(): void {
    this._user.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }

  private getUserFromLocalStorage(): User | null {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    return token && email ? { token, email } : null;
  }
}
