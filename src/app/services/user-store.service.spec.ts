import { TestBed } from '@angular/core/testing';
import { UserStoreService } from './user-store.service';
import { User } from '../models/user.model';

describe('UserStoreService', () => {
  let service: UserStoreService;
  const mockUser: User = {
    token: 'test-token',
    email: 'test@example.com'
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStoreService);
  });

  it('debería establecer el usuario y guardarlo en localStorage', () => {
    service.setUser(mockUser);
    expect(service.user()).toEqual(mockUser);
    expect(localStorage.getItem('token')).toBe(mockUser.token);
    expect(localStorage.getItem('email')).toBe(mockUser.email);
  });

  it('debería limpiar el usuario y removerlo del localStorage', () => {
    service.setUser(mockUser);
    service.clearUser();
    expect(service.user()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('email')).toBeNull();
  });

  it('debería retornar true si el usuario tiene token', () => {
    service.setUser(mockUser);
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('debería retornar false si no hay usuario', () => {
    service.clearUser();
    expect(service.isAuthenticated()).toBeFalse();
  });
  
  it('debería inicializar con null si localStorage está vacío', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');

    const newService = TestBed.inject(UserStoreService);
    expect(newService.user()).toBeNull();
    expect(newService.isAuthenticated()).toBeFalse();
  });
});
