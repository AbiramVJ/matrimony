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
  public images: string[] = [];

  constructor(private fb:FormBuilder){
    this._userBasicFromInit();
  }

  private _userBasicFromInit(){
    this.userBasicFrom = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      gender: ['male', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      maritalStatus: ['single', [Validators.required]],
      height: ['', [Validators.required, Validators.min(1)]],
      weight: ['', [Validators.required, Validators.min(1)]]
    })
  }

  private _validateFiled(){
    console.log(this.userBasicFrom.value);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.images.push(reader.result as string);
    };

    reader.readAsDataURL(file);

    input.value = '';
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
  }

  next(){
    this.isSubmitted = true;
    this.basicDetailsEmitter.emit(this.userBasicFrom.value);
    if(this.userBasicFrom.valid && this.images.length > 0){
      this.basicDetailsEmitter.emit(this.userBasicFrom.value);
    }
  }
}
