import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserStoreService } from '../../services/user-store.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userStore = inject(UserStoreService);

  if (userStore.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
