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
import { MemberService } from '../../../../services/member.service';

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
  isAgent:boolean = false;
  constructor(private authService: SocialAuthService,
    private auth:AuthService,
    private toastr: ToastrService,
    private router:Router,
    private _memberService:MemberService,
  ) {}

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
    this.isLoading = true;
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
          this.toastr.success('Successful',`Sign-in successful with ${this.user?.name}`);
        },
        complete:()=>{
          // this.isLoading = false;
          if(!this.isAgent){
          // this._getMemberList();
           window.location.href = "/";
          }
        },
        error:(error:any) =>{
          this.isLoading = false;
          this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
          this.router.navigateByUrl('login');
          this.authService.signOut();
        }
      })
  }

  //private _getMemberList(){
    // this.auth.memberList$.subscribe(data => {
    //    if(data === null){
    //       this.auth.setUserDetails(null);
    //       this.router.navigateByUrl('member/member-registration');
    //       return;
    //     }else{
    //       this.auth.setUserDetails(data[0].id);
    //       this.router.navigateByUrl('home/member');
    //     }
    // })

//  }

private _getMemberList(){
    this._memberService.getProfiles().subscribe({
      next:(res:any) => {
       if(res.length === 0){
          this.auth.setMemberList(null);
          this.router.navigateByUrl('member/member-registration');
          return;
        }else{
          this.auth.setMemberList(res);
          this.router.navigateByUrl('home/member');
        }
      },
      complete:() =>{
        this.isLoading = false;
      },
      error:(error:any)=>{
      this.isLoading = false;
      }
    })
  }
}
