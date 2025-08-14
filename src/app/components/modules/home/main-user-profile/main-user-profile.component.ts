import { MainUser, UserProfile } from './../../../../models/member/member.model';
import { Component } from '@angular/core';
import { FORM_MODULES } from '../../../../common/common-imports';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../../../services/member.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { SocialLoginService } from '../../../../services/auth/social-login.service';

@Component({
  selector: 'app-main-user-profile',
  imports: [FORM_MODULES, CommonModule, ],
  templateUrl: './main-user-profile.component.html',
  styleUrl: './main-user-profile.component.scss'
})
export class MainUserProfileComponent {
  profileForm: FormGroup;
  isLoading = false;
  imagePreview: string | null = null;
  mainUser!:MainUser;
  public selectedMember!:UserProfile;
  public memberProfiles: UserProfile[] = [];

constructor(private fb: FormBuilder,
  private _memberService:MemberService,
  private _authService: AuthService,
  private _socialLoginService: SocialLoginService
) {
    this.profileForm = this.fb.group({
      firstName: ['fse', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      image: ['']
    });
  }

   ngOnInit(): void {
    this.loadProfileData();
    this._getCurrentMember();
    this._getMemberProfiles();
  }

   loadProfileData(): void {
    this.isLoading = true;
    this._memberService.getMainUser().subscribe({
      next:(res:any)=>{
      this.mainUser = res;

      },
      complete:()=>{
        this.profileForm.patchValue({
          firstName: this.mainUser.firstName,
          lastName: this.mainUser.lastName,
          email: this.mainUser.email,
          phoneNumber: this.mainUser.phoneNumber,
          image: this.mainUser.image
        });
        this.isLoading = false;
      },
      error:(error:any)=>{
        this.isLoading = false;
      }
    })
  }


   onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.profileForm.patchValue({ image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
   }

   _authLogout() {
    this._authService.removeAuthToken();
    this._socialLoginService.signOut();
    localStorage.removeItem('clientId');
    localStorage.removeItem('currentMemberId');
    this._authService.setUserDetails(null);
    window.location.href = '/';
  }

  private _getCurrentMember(){
  this._authService.member$.subscribe(data => {
      if(data){
        this.selectedMember = data;
      }
    })
  }


  private _getMemberProfiles() {
    this._authService.memberList$.subscribe((data) => {
      if (data) {
        this.memberProfiles = data;
      }
    });
  }

  public changeMemberProfile() {
    localStorage.removeItem('currentMemberId');
    localStorage.setItem('currentMemberId', this.selectedMember.id);
    window.location.href = '/';
  }
}
