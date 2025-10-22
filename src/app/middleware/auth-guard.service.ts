import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService: AuthService, private router: Router ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    //const routeUser = route.data['user'];
    //const roles = userRoleNames;
    const user = this.authService.getUserType();
    const routeUserAccess = route.data['accessUsers'];
    if (routeUserAccess.includes(user)) {
        // this.authService.isActiveSubscription$.subscribe((active: boolean | null) => {
        //   // if(!active){
        //   //   this.router.navigateByUrl('member/billing');
        //   // }
        //    if(!active && route.routeConfig?.path !== 'member/billing' && !route.routeConfig?.path?.includes('member/billing')) {
        //          this.router.navigateByUrl('member/billing');
        //     }
        // });
      return true;
    } else {
      this.router.navigateByUrl('not-found');
      return true;

    }
  }
}
