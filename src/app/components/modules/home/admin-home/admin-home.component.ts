import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-admin-home',
  imports: [],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent {
  constructor(private _authService: AuthService,){

  }
  _authLogout() {
    this._authService.removeAuthToken();
    localStorage.removeItem('clientId');
    localStorage.removeItem('userType');
    localStorage.removeItem('currentMemberId');
    this._authService.setUserDetails(null);
    window.location.href = '/';
  }
}
