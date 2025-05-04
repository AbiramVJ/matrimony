import { Injectable, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { SocialFirebaseResponse } from '../../models/index.model';
import {
  SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialUser
} from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class SocialLoginService {
  currentUser = signal<SocialUser | null>(null);

  constructor(private authService: SocialAuthService) {
    this.getLoginUserDetails();
  }

  getLoginUserDetails(){
    this.authService.authState.subscribe((user) => {
      this.currentUser.set(user);
    });
  }

  signInWithGoogle(): Promise<SocialUser> {
    return this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFacebook(): Promise<SocialUser> {
    return this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

}
