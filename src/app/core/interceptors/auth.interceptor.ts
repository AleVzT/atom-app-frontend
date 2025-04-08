import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserStoreService } from '../../services/user-store.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const userStore = inject(UserStoreService);
  const token = userStore.user()?.token;

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
