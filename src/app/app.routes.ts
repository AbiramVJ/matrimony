import { Routes } from '@angular/router';
import { DeActiveService } from './middleware/de-active.service';
import { CanActiveService } from './middleware/can-active.service';
import { userRoleNames as role } from './helpers/util';
import { AuthGuardService } from './middleware/auth-guard.service';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent),
    canActivate:[DeActiveService]
  },
  {
    path:'not-found',
    loadComponent:() => import('./common/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./components/modules/home/home.component').then(m => m.HomeComponent),
    canActivate:[CanActiveService]
  },
  {
    path:'member',
    loadChildren:() => import('./components/modules/member/member.routing.module').then(m => m.MembersRoutingModules),
  }
];

