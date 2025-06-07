import { Routes } from '@angular/router';
import { userRoleNames as role } from '../../../helpers/util';
import { MemberHomeComponent } from './member-home/member-home.component';
import { MemberDetailsComponent } from './member-home/member-details/member-details.component';
export const HomeRoutingModules: Routes = [
 {
  path:'member',
  loadComponent: () => import('./member-home/member-home.component').then(m => m.MemberHomeComponent),
  data:{accessUsers: [role.member]},
   children: [
      { path: 'profile', component: MemberDetailsComponent },

    ]
 },
 {
  path:'profile/:id',
  loadComponent: () => import('./member-home/member-details/member-details.component').then(m => m.MemberDetailsComponent),
  data:{accessUsers: [role.member]}
 },
 {
  path:'main-user',
  loadComponent: () => import('./main-user-profile/main-user-profile.component').then(m => m.MainUserProfileComponent),
  data:{accessUsers: [role.member]}
 },


];



