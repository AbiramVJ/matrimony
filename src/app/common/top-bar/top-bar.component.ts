import { userType } from './../../helpers/util';
import { Component } from '@angular/core';
import { SocialLoginService } from '../../services/auth/social-login.service';


@Component({
  selector: 'app-top-bar',
  imports: [],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {

  public currentUser:any;

  constructor(private socialLoginService:SocialLoginService){

  }
}
