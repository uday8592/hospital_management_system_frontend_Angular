import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowed = route.data['roles'] as string[];
  const role = auth.currentUser()?.role;

  if (!role || !allowed.includes(role)) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
