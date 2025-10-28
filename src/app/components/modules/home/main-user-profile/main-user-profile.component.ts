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
  public isChangesPasswordLoading:boolean = false;
  public imagePreview: string | null = null;
  public mainUser!:MainUser;
  public selectedMember!:UserProfile;
  public memberProfiles: UserProfile[] = [];
  public isGeneral:boolean = true;
  public isSaveLoading:boolean = false;
  public isSubmitted:boolean = false;
  public isMatchPwd:boolean = true;

  public resetPasswordFrom!:FormGroup;
  public images:string = '';

  public passwordStrength = {
    value: 0,
    text: 'None',
    class: ''
  };

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
      correctPassword:[null],
      newPassword:[null,[Validators.required]],
      confirmNewPassword:[null,[Validators.required]],
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
    body.phoneNumber = this.profileForm.value.phoneNumber;

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

  public updatePasswordStrength(isSignUp:boolean): void {
    let password = null;
    password = this.resetPasswordFrom.get('newPassword')?.value;
    this.passwordStrength = { value: 0, text: 'None', class: '' };
    if (!password || password.length === 0) return;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    this.passwordStrength.value = strength;
    if (strength < 30) {
      this.passwordStrength.class = 'bg-danger';
      this.passwordStrength.text = 'Weak';
    } else if (strength < 60) {
      this.passwordStrength.class = 'bg-warning';
      this.passwordStrength.text = 'Fair';
    } else if (strength < 80) {
      this.passwordStrength.class = 'bg-info';
      this.passwordStrength.text = 'Good';
    } else {
      this.passwordStrength.class = 'bg-success';
      this.passwordStrength.text = 'Excellent';
    }
  }

  public changesPassword(){
    this.isSubmitted = true;
    this.resetPasswordFrom.valid;
    const pwdValues = this.resetPasswordFrom.value;
    if(pwdValues.newPassword === pwdValues.confirmNewPassword ){
      this.isMatchPwd = true;
    }else{
      this.isMatchPwd = false;
      return;
    }
    if(this.resetPasswordFrom.valid){
    this.isChangesPasswordLoading = true;
    let body = {
        isSetNewPassword:this.mainUser.isPasswordReset ? false : true,
        currentPassword:this.mainUser.isPasswordReset ? this.resetPasswordFrom.value.correctPassword : null,
        newPassword: this.resetPasswordFrom.value.newPassword
      }

    this._authService.changePassword(body).subscribe({
      next:(res:any)=>{
          this._authService.setAuthToken(res.Result.token);
      },
      complete:()=>{
        this.mainUser.isPasswordReset = true;
        this._authService.setMainUser(this.mainUser);
        this.isChangesPasswordLoading = false;
        this.isSubmitted = false;
        this.resetPasswordFrom.reset();
        this.passwordStrength = {
            value: 0,
            text: 'None',
            class: ''
          };

        this.toastr.success('Password successfully updated','Success');

      },
      error:(error:any)=>{
        this.isChangesPasswordLoading = false;
        this.isSubmitted = false;
        this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
      }
    })
    }
  }
  public onInputChange() {
      this.isMatchPwd = true;
    }


}
