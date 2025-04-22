import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { COMMON_DIRECTIVES } from '../../../../common/common-imports';
import { AuthService } from '../../../../services/auth/auth.service';
import { SocialLoginService } from '../../../../services/auth/social-login.service';

@Component({
  selector: 'app-profile-selection',
  imports: [CommonModule,COMMON_DIRECTIVES],
  templateUrl: './profile-selection.component.html',
  styleUrl: './profile-selection.component.scss'
})
export class ProfileSelectionComponent {

  constructor(private auth:AuthService,private socialLoginService:SocialLoginService){

  }
  public memberProfiles = [
    {
      profileImage: 'https://cdn.pixabay.com/photo/2022/09/08/15/16/cute-7441224_640.jpg',
      name: 'John Doe',
      isActive: true
    },
    {
      profileImage: 'https://png.pngtree.com/thumb_back/fh260/background/20230615/pngtree-man-wearing-a-pair-of-yellow-sunglasses-in-front-of-a-image_2898170.jpg',
      name: 'Emma Watson',
      isActive: false
    },
    {
      profileImage: 'https://png.pngtree.com/thumb_back/fh260/background/20230516/pngtree-man-in-sunglasses-with-a-brown-jacket-and-black-shirt-facing-image_2577061.jpg',
      name: 'Michael Scott',
      isActive: true
    },
  ];

  _authLogout() {
    this.auth.removeAuthToken();
    this.socialLoginService.signOut();
    window.location.href = "/";
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('clientId');
  }
}
