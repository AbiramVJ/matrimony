import { MemberService } from './../../../../../../services/member.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../../common/common-imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserBasicForm } from '../../../../../../models/index.model';

@Component({
  selector: 'app-member-profile-form',
  imports: [COMMON_DIRECTIVES,FORM_MODULES],
  templateUrl: './member-profile-form.component.html',
  styleUrl: './member-profile-form.component.scss',
  standalone:true,
})
export class MemberProfileFormComponent {
  @Output() basicDetailsEmitter = new EventEmitter<UserBasicForm>();
  public isSubmitted:Boolean = false;
  public userBasicFrom!:FormGroup;
  public isLoading:boolean = false;
  public isUploading:boolean = false;
  public images: string[] = [];

  constructor(private fb:FormBuilder, private _memberService:MemberService){
    this._userBasicFromInit();
  }

  private _userBasicFromInit(){
    this.userBasicFrom = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      gender: [1, [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      maritalStatus: [1, [Validators.required]],
      height: ['', [Validators.required, Validators.min(1)]],
      weight: ['', [Validators.required, Validators.min(1)]],
      profilesImg:[],
      isVisible:[true],
    })
  }

  onFileSelected(event: Event): void {
    this.isUploading = false;
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this._memberService.uploadImageToBulb(formData).subscribe({
      next: (res) => {
        this.images.push(res.Result);
      },
      complete:() => {
        this.isUploading = false;
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.isUploading = false;
      }
    });

    input.value = '';
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
  }

  next(){
    this.isSubmitted = true;
    const profileImages = this.images.map((url, index) => ({ url, isProfile: index === 0, isVisible: this.userBasicFrom.value.isVisible }));
    this.userBasicFrom.get('profilesImg')?.setValue(profileImages);
    if(this.userBasicFrom.valid && this.images.length > 0){
      this.basicDetailsEmitter.emit(this.userBasicFrom.value);
    }
  }
}
