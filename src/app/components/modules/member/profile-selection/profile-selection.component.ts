import { MemberService } from './../../../../services/member.service';
import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES, ROUTER_MODULES } from '../../../../common/common-imports';
import { AuthService } from '../../../../services/auth/auth.service';
import { SocialLoginService } from '../../../../services/auth/social-login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserProfile } from '../../../../models/index.model';
@Component({
  selector: 'app-profile-selection',
  imports: [CommonModule, COMMON_DIRECTIVES, FORM_MODULES,ROUTER_MODULES],
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
  ){

  }


  public memberProfiles:UserProfile[] = [];
  public isLoading:boolean = false;
  public deleteMemberId:string = '';

  ngOnInit(): void {
   this._getMemberProfiles();
  this.scrollToTop();
  }

  private scrollToTop(): void {
   window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // this.isLoading = true;
    // this._memberService.getProfiles().subscribe({
    //   next:(res:any) => {
    //     this.memberProfiles = res;
    //     this.isLoading = false;
    //   },
    //   complete:() => {

    //   },
    //   error:(error:any) => {
    //     this.isLoading = false;
    //     this._toastr.error(error.error.Error.Detail,error.error.Error.Title);
    //   }
    // })

     this.auth.memberList$.subscribe(data => {
      if(data){
        this.memberProfiles = data;
      }
    })
  }


  public navigateToFrom(){
    this.router.navigateByUrl('member/member-registration');
  }

  public navigateToEditForm(memberId:string){
   this.router.navigate(['member/member-registration/edit', memberId]);
  }

  public navigateToHome(){
  // this.router.navigateByUrl('home/member/'+ memberId);
  //  this.auth.setUserDetails(memberId);
  //  this.auth.setMember(memberId);
  }

  public deleteMember(){
    this.isLoading = true;
    this._memberService.deleteMember(this.deleteMemberId).subscribe({
      next:(res:any) => {
        this._getMemberList();
      },
      complete:() => {

      },
      error:(error:any) => {
       this.isLoading = false;
       this._toastr.error(error.error.Error.Detail,error.error.Error.Title);
      }
    })
  }

  private _getMemberList(){
    this.isLoading = true;
    this._memberService.getProfiles().subscribe({
      next:(res:any) => {
        if(res.length  === 0){
          window.location.href = "/";
        }else{
          this.auth.setMemberList(res);
          this.isLoading = false;
          let deleteModal: HTMLElement = document.getElementById('deleteMemberModalId') as HTMLElement;
          deleteModal.click();
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
