import { MainUser } from './../../../../models/member/member.model';
import { Component } from '@angular/core';
import { FORM_MODULES } from '../../../../common/common-imports';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../../../services/member.service';

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

constructor(private fb: FormBuilder,private _memberService:MemberService,) {
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
        console.log(error);
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
}
