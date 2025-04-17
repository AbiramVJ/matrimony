import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
  SocialLoginModule,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { LoginType } from '../../../../helpers/enum';
import { AuthService } from '../../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { fbAppId } from '../../../../environments/environment';

@Component({
  selector: 'app-social-login',
  standalone: true,
  imports: [CommonModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    ],
  providers: [],
  templateUrl: './social-login.component.html',
  styleUrls:['./social-login.component.scss']
})
export class SocialLoginComponent {
  user: SocialUser | null = null;
  isGoogle:boolean = true;
  isLoading:boolean = false;

  constructor(private authService: SocialAuthService,private auth:AuthService, private toastr: ToastrService, private router:Router,) {}

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      user.provider === 'GOOGLE' ? this.isGoogle = true : this.isGoogle = false;
      if(user){
        this._makeSocialLogin();
      }
    });
  }

  signInWithFacebook(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then(user => console.log(user))
      .catch(error => this.toastr.error('Facebook sign-in error',error));
  }

  signOut(): void {
    this.authService.signOut();
  }

  private _makeSocialLogin(){
    const body =
      {
        loginType: this.isGoogle ? LoginType.Google :LoginType.Facebook ,
        socialToken: this.isGoogle ? this.user?.idToken : this.user?.authToken,
        socialClientId: this.isGoogle ? '' : fbAppId,
        firstName: this.user?.firstName,
        lastName:this.user?.lastName,
      }
      const clientToken = localStorage.getItem('clientId') || '';
      this.auth.socialLogin(body, clientToken).subscribe({
        next:(res:any) => {
          this.auth.setAuthToken(res.Result.token);
          this.auth.setUser();
          this.toastr.success('Successful',`Sign-in successful with ${this.user?.name}`)
        },
        complete:()=>{
          this.isLoading = false;
          this.router.navigateByUrl('home');
        },
        error:(error:any) =>{
          this.isLoading = false;
          this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
          this.router.navigateByUrl('login');
          this.authService.signOut();
        }
      })
  }
}
