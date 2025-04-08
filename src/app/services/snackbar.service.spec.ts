import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  let service: SnackbarService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        SnackbarService,
        { provide: MatSnackBar, useValue: spy }
      ]
    });

    service = TestBed.inject(SnackbarService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('debería mostrar un snackbar con el mensaje y duración por defecto', () => {
    service.show('Hola mundo');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Hola mundo',
      'Cerrar',
      jasmine.objectContaining({
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      })
    );
  });

  it('debería mostrar un snackbar con una duración personalizada', () => {
    service.show('Mensaje rápido', 1000);

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Mensaje rápido',
      'Cerrar',
      jasmine.objectContaining({
        duration: 1000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      })
    );
  });
});
