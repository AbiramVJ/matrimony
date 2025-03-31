import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { SocialFirebaseResponse } from '../../models/index.model';


@Injectable({
  providedIn: 'root'
})
export class SocialLoginService {

  constructor(private afAuth: AngularFireAuth,) { }

  public async signInWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const res = await this.afAuth.signInWithPopup(provider);
      console.log(res);
      const result = new SocialFirebaseResponse(res);
      return result;
    } catch (error) {
      throw error;
    }
  }


  public async signInWithFacebook() {
    try {
      const provider = new firebase.auth.FacebookAuthProvider();
      const res = await this.afAuth.signInWithPopup(provider);
      const result = new SocialFirebaseResponse(res);
      return result;
    } catch (error) {
      throw error;
    }
  }

}
