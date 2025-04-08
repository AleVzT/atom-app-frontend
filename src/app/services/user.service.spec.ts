import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { UserStoreService } from './user-store.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let userStoreSpy: jasmine.SpyObj<UserStoreService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const baseUrl = `${environment.baseUrl}/users`;

  const mockUser: User = {
    email: 'test@example.com',
    token: 'fake-token'
  };

  beforeEach(() => {
    userStoreSpy = jasmine.createSpyObj('UserStoreService', ['setUser', 'clearUser', 'user', 'isAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: UserStoreService, useValue: userStoreSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería hacer login y guardar el usuario', () => {
    service.login(mockUser.email).subscribe((res) => {
      expect(res).toEqual(mockUser);
      expect(userStoreSpy.setUser).toHaveBeenCalledWith(mockUser);
    });

    const req = httpMock.expectOne(`${baseUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: mockUser.email });

    req.flush(mockUser);
  });

  it('debería registrar un usuario y guardarlo', () => {
    service.register(mockUser.email).subscribe((res) => {
      expect(res).toEqual(mockUser);
      expect(userStoreSpy.setUser).toHaveBeenCalledWith(mockUser);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: mockUser.email });

    req.flush(mockUser);
  });

  it('debería cerrar sesión y redirigir al login', () => {
    service.logout();
    expect(userStoreSpy.clearUser).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería retornar el usuario actual', () => {
    userStoreSpy.user.and.returnValue(mockUser);
    const user = service.getCurrentUser();
    expect(user).toEqual(mockUser);
  });

  it('debería retornar si está autenticado', () => {
    userStoreSpy.isAuthenticated.and.returnValue(true);
    const result = service.isAuthenticated();
    expect(result).toBeTrue();
  });
});
