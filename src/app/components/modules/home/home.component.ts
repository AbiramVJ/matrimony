import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private auth:AuthService,){

  }
  _authLogout() {
    this.auth.removeAuthToken();
    window.location.href = "/";
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
  }
}
