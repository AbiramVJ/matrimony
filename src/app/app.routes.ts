import { Routes } from '@angular/router';
import { DeActiveService } from './middleware/de-active.service';
import { CanActiveService } from './middleware/can-active.service';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent),
    canActivate:[DeActiveService]
  },
  {
    path: 'home',
    loadComponent: () => import('./components/modules/home/home.component').then(m => m.HomeComponent),
    canActivate:[CanActiveService]
  },
];

