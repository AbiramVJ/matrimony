import { inject, Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from '@angular/fire/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class SocialLoginService {
  private auth = inject(Auth); // Use Angular’s inject function

  public async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      return await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Error during Google sign in', error);
      throw error;
    }
  }

  public async signInWithFacebook() {
    try {
      const provider = new FacebookAuthProvider();
      return await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Error during Facebook sign in', error);
      throw error;
    }
  }

  public async signInWithApple() {
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      provider.setCustomParameters({ locale: navigator.language || 'en' });
      return await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Error during Apple sign in', error);
      throw error;
    }
  }
}
