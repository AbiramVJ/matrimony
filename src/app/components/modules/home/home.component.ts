import { Component } from '@angular/core';
import { SocialLoginService } from '../../../services/auth/social-login.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private auth:AuthService,private socialLoginService:SocialLoginService){

  }
  _authLogout() {
    this.auth.removeAuthToken();
    this.socialLoginService.signOut();
    window.location.href = "/";
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('clientId');
  }
}
