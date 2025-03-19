import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  // {
  //   path: 'sign-up',
  //   loadComponent: () => import('./components/auth/sign-up/sign-up.component').then(m => m.SignUpComponent)
  // },
];
