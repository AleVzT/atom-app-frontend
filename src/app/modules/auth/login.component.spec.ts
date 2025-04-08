import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { ConfirmCreateDialogComponent } from '../../shared/confirm-create-dialog.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['login', 'register']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('no debe llamar a login si el email está vacío', () => {
    component.email = '';
    component.onLogin();
    expect(mockUserService.login).not.toHaveBeenCalled();
  });

  it('debe llamar a login y navegar si es exitoso', () => {
    component.email = 'test@example.com';
    mockUserService.login.and.returnValue(of({ email: 'test@example.com', token: 'fake-token' }));
    component.onLogin();

    expect(mockUserService.login).toHaveBeenCalledWith('test@example.com');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('debe abrir el diálogo si el login falla', fakeAsync(() => {
    component.email = 'test@example.com';
    mockUserService.login.and.returnValue(throwError(() => new Error('error')));

    const afterClosedSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    afterClosedSpy.afterClosed.and.returnValue(of(true));
    mockDialog.open.and.returnValue(afterClosedSpy);

    mockUserService.register.and.returnValue(of({ email: 'test@example.com', token: 'fake-token' }));

    component.onLogin();
    tick();

    expect(mockDialog.open).toHaveBeenCalledWith(ConfirmCreateDialogComponent);
    expect(mockUserService.register).toHaveBeenCalledWith('test@example.com');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
  }));

  it('debe no registrar si se cierra el diálogo sin aceptar', fakeAsync(() => {
    component.email = 'test@example.com';
    mockUserService.login.and.returnValue(throwError(() => new Error('error')));

    const afterClosedSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    afterClosedSpy.afterClosed.and.returnValue(of(false));
    mockDialog.open.and.returnValue(afterClosedSpy);

    component.onLogin();
    tick();

    expect(mockUserService.register).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));
});
