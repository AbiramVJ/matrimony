import { inject } from '@angular/core';
import { CanDeactivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { map, take } from 'rxjs/operators';

export const deactivateGuard: CanDeactivateFn<unknown> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Use observable properly
  return authService.isActiveSubscription$.pipe(
    take(1),
    map((active: boolean | null) => {
      if (active === false) {
        router.navigateByUrl('member/billing');
        return false; // block navigation
      }
      return true; // allow navigation
    })
  );
};
