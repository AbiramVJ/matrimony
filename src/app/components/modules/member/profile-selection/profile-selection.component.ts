import { MemberService } from './../../../../services/member.service';
import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../common/common-imports';
import { AuthService } from '../../../../services/auth/auth.service';
import { SocialLoginService } from '../../../../services/auth/social-login.service';
import { Router } from '@angular/router';
import { TopBarComponent } from "../../../../common/top-bar/top-bar.component";
import { ToastrService } from 'ngx-toastr';
import { UserProfile } from '../../../../models/index.model';
@Component({
  selector: 'app-profile-selection',
  imports: [CommonModule, COMMON_DIRECTIVES, TopBarComponent, FORM_MODULES],
  templateUrl: './profile-selection.component.html',
  styleUrl: './profile-selection.component.scss'
})
export class ProfileSelectionComponent {

  constructor(
    private auth:AuthService,
    private socialLoginService:SocialLoginService,
    private router:Router,
    private _memberService:MemberService,
    private _toastr: ToastrService,
  ){}


  public memberProfiles:UserProfile[] = [];
  public isLoading:boolean = false;

  ngOnInit(): void {
   this._getMemberProfiles();

  }

  _authLogout() {
    this.auth.removeAuthToken();
    this.socialLoginService.signOut();
    window.location.href = "/";
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('clientId');
  }

  private _getMemberProfiles(){
    this.isLoading = true;
    this._memberService.getProfiles().subscribe({
      next:(res:any) => {
        this.memberProfiles = res;
        console.log(res)
        this.isLoading = false;
      },
      complete:() => {

      },
      error:(error:any) => {
        this.isLoading = false;
        this._toastr.error(error.error.Error.Detail,error.error.Error.Title);
      }
    })
  }


  public navigateToFrom(){
    this.router.navigateByUrl('member/member-registration');
  }
}
