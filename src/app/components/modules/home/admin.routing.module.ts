import { Routes } from "@angular/router";
import { userRoleNames as role } from '../../../helpers/util';

export const AdminRoutingModules: Routes = [
  {
  path:'home',
  loadComponent: () => import('./admin-home/admin-home.component').then(m => m.AdminHomeComponent),
  data:{accessUsers: [role.adminUser]}
 },
]
