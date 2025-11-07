import { inject } from '@angular/core';
import { CanDeactivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { map, take } from 'rxjs/operators';

export const deactivateGuard: CanDeactivateFn<unknown> = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isActiveSubscription$.pipe(
    take(1),
    map((active: boolean | null) => {
      if (active === false) {
        router.navigateByUrl('member/billing');
        return false;
      }
      return true;
    })
  );
};
