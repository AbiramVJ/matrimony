import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth/auth.service';
import { SocialLoginService } from '../services/auth/social-login.service';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
 // const toastr = inject(ToastrService);
  const _authService = inject(AuthService);
  const _socialLoginService = inject(SocialLoginService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const status = error.status;

      if ([401, 403].includes(status)) {
        _authService.removeAuthToken();
        _socialLoginService.signOut();
        localStorage.removeItem('clientId');
        localStorage.removeItem('currentMemberId');
        _authService.setUserDetails(null);

        // if (status === 401) {
        //   toastr.warning('Session expired. Please log in again.');
        // } else if (status === 403) {
        //   toastr.error('Access denied.');
        // } else if (status === 404) {
        //   toastr.info('Resource not found.');
        // }
        router.navigateByUrl('/login');
      } else {
      //  toastr.error(error.message || 'An unknown error occurred');
      }

      return throwError(() => error);
    })
  );
};
