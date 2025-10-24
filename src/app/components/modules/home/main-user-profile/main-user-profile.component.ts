import { MainUser, UserProfile } from './../../../../models/member/member.model';
import { Component } from '@angular/core';
import { FORM_MODULES } from '../../../../common/common-imports';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../../../services/member.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { SocialLoginService } from '../../../../services/auth/social-login.service';
import { ImageCropperComponent } from "../../../../common/image-cropper/image-cropper.component";
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from "../../../../common/loading/loading.component";


@Component({
  selector: 'app-main-user-profile',
  imports: [FORM_MODULES, CommonModule, ImageCropperComponent, LoadingComponent],
  templateUrl: './main-user-profile.component.html',
  styleUrl: './main-user-profile.component.scss'
})
export class MainUserProfileComponent {

  public profileForm: FormGroup;
  public isLoading = false;
  public imagePreview: string | null = null;
  public mainUser!:MainUser;
  public selectedMember!:UserProfile;
  public memberProfiles: UserProfile[] = [];
  public isGeneral:boolean = true;
  public isSaveLoading:boolean = false;

  public resetPasswordFrom!:FormGroup;
  public images:string = '';

constructor(private fb: FormBuilder,
  private _memberService:MemberService,
  private _authService: AuthService,
  private _socialLoginService: SocialLoginService,
  private toastr: ToastrService,
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
    this._resetFromInit();
  }

  private _resetFromInit(){
    this.resetPasswordFrom = this.fb.group({
      correctPassword:['',[Validators.required]],
      newPassword:['',[Validators.required]],
      confirmNewPassword:['',[Validators.required]],
    })
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
        this.images = this.mainUser.image;
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

   onImageCropped(event: any): void {
    this.images = event;
    this.mainUser.image = event;
    let viewModal: HTMLElement = document.getElementById(
          'close-btn'
        ) as HTMLElement;
        if (viewModal) {
          viewModal.click();
        }
  }

  public saveUser(){
    this.isSaveLoading = true;
    let body = this.mainUser;
    body.firstName = this.profileForm.value.firstName;
    body.lastName = this.profileForm.value.lastName;
    body.image = this.images;

    this._memberService.editMainUser(body).subscribe({
      next:(res:any)=>{

      },
      complete:()=>{
        this.isSaveLoading = false;
        this.mainUser = body;
        this._authService.setMainUser(this.mainUser);
      },
      error:(error:any)=>{
        this.isSaveLoading = false;
        this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
      }
    })
  }
}
