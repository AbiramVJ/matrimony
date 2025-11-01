import { MemberApproval } from './../helpers/enum';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApprovalGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.memberList$.pipe(
      take(1),
      map((memberList) => {
          if(memberList && memberList.length === 1 && memberList[0].memberApproval === MemberApproval.Pending){
             return this.router.createUrlTree(['member/approval']);
          }else{
            return this.router.createUrlTree(['home/member']);
          }

      })
    );
  }
}
