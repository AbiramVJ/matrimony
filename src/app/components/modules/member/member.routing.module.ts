import { LoginComponent } from './../../auth/login/login.component';
import { Routes } from '@angular/router';
import { AuthGuardService } from '../../../middleware/auth-guard.service';
import { userRoleNames as role } from '../../../helpers/util';

export const MembersRoutingModules: Routes = [
 {
  path:'profiles',
  loadComponent:()=> import('./profile-selection/profile-selection.component').then(m => m.ProfileSelectionComponent),
  canActivate:[AuthGuardService],
  data:{accessUsers: [role.member]}
 },

 {
  path:'member-registration',
  loadComponent:() => import('./member-registration/member-form/member-form.component').then(m => m.MemberFormComponent),
  canActivate:[AuthGuardService],
  data:{accessUsers: [role.member]}
 }

];
