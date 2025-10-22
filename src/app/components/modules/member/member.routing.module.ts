
import { Routes } from '@angular/router';
import { AuthGuardService } from '../../../middleware/auth-guard.service';
import { userRoleNames as role } from '../../../helpers/util';
import { DeActiveService } from '../../../middleware/de-active.service';
import { deactivateGuard } from '../../../middleware/deactivate.guard';

export const MembersRoutingModules: Routes = [
{
  path:'plans',
  loadComponent:()=> import('./subscription-plan/subscription-plan.component').then(m => m.SubscriptionPlanComponent),
  canActivate:[AuthGuardService],
  data:{accessUsers: [role.member]}
 },
 {
  path:'payment/:id',
  loadComponent:()=> import('./stripe-payment/stripe-payment.component').then(m => m.StripePaymentComponent),
  canActivate:[AuthGuardService],
  data:{accessUsers: [role.member]}
 },
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
 },

 {
  path:'member-registration/edit/:id',
  loadComponent:() => import('./member-registration/member-edit-form/member-edit-form.component').then(m => m.MemberEditFormComponent),
  canActivate:[AuthGuardService],
  data:{accessUsers: [role.member]}
 },
 {
  path:'billing',
  loadComponent:() => import('./billing/billing.component').then(m => m.BillingComponent),
  data:{accessUsers: [role.member]},
  canDeactivate: [deactivateGuard]
}


];
