import { Routes } from '@angular/router';
import { DeActiveService } from './middleware/de-active.service';
import { CanActivateService } from './middleware/can-active.service';
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
    loadChildren: () => import('./components/modules/home/home.routing.module').then(m => m.HomeRoutingModules),
    canActivate:[CanActivateService],
    data:{accessUsers: [role.member]}

  },
  {
    path:'member',
    loadChildren:() => import('./components/modules/member/member.routing.module').then(m => m.MembersRoutingModules),
  },

  //ADMIN
  {
    path:'admin/login',
    loadComponent:() => import('./components/auth/Admin/admin-login/admin-login.component').then(m => m.AdminLoginComponent),
    canActivate:[DeActiveService],
    data:{accessUsers: [role.adminUser]}
  },

  {
    path: 'admin',
    loadChildren: () => import('./components/modules/home/admin.routing.module').then(m => m.AdminRoutingModules),
    canActivate:[AuthGuardService],
    data:{accessUsers: [role.adminUser]}
  },

];

