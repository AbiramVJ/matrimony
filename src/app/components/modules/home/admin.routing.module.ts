import { Routes } from "@angular/router";
import { userRoleNames as role } from '../../../helpers/util';

export const AdminRoutingModules: Routes = [
  {
  path:'home',
  loadComponent: () => import('./admin-home/admin-home.component').then(m => m.AdminHomeComponent),
  data:{accessUsers: [role.adminUser]}
 },
 {
  path:'community',
  loadComponent: () => import('./admin-home/community/community.component').then(m => m.CommunityComponent),
  data:{accessUsers: [role.adminUser]}
 },
 {
  path:'religion',
  loadComponent: () => import('./admin-home/religion/religion.component').then(m => m.ReligionComponent),
  data:{accessUsers: [role.adminUser]}
 },
 {
  path:'dashboard',
  loadComponent: () => import('./admin-home/dashboard/dashboard.component').then(m => m.DashboardComponent),
  data:{accessUsers: [role.adminUser]}
 },
 {
  path:'jobs',
  loadComponent: () => import('./admin-home/jobs/jobs.component').then(m => m.JobsComponent),
  data:{accessUsers: [role.adminUser]}
 },
 {
  path:'educations',
  loadComponent: () => import('./admin-home/educations/educations.component').then(m => m.EducationsComponent),
  data:{accessUsers: [role.adminUser]}
 },
 {
  path:'subscription',
  loadComponent: () => import('./admin-home/subscription/subscription.component').then(m => m.SubscriptionComponent),
  data:{accessUsers: [role.adminUser]}
 }
]
