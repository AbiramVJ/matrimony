import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanActiveService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const routeUserAccess = route.data['accessUsers'];
    const loginUserType = this.authService.getUserType();
  // console.log(this.authService.isLoggedIn())
    if(this.authService.isLoggedIn()) {
      return this.authService.isLoggedIn();
    }
    this.router.navigateByUrl('member/profiles');
    return !this.authService.isLoggedIn();
  }
}
