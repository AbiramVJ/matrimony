import { Component, Output, EventEmitter } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../../common/common-imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { familyTypeList } from '../../../../../../helpers/data';
import { UserFamilyInfo } from '../../../../../../models/index.model';

@Component({
  selector: 'app-family-information-form',
  imports: [COMMON_DIRECTIVES, FORM_MODULES],
  templateUrl: './family-information-form.component.html',
  styleUrl: './family-information-form.component.scss'
})
export class FamilyInformationFormComponent {
  @Output() userFamilyEmitter = new EventEmitter<UserFamilyInfo>();
  public userFamilyInfoForm!:FormGroup;
  public isSubmitted:boolean = false;
  public familyTypeList = familyTypeList;
  constructor(private fb:FormBuilder){
    this._userFamilyInfoFormInit();
  }

  private _userFamilyInfoFormInit(){
    this.userFamilyInfoForm = this.fb.group({
      fatherName:['',Validators.required],
      motherName:['',Validators.required],
      fatherOccupation:['',Validators.required],
      matherOccupation:['',Validators.required],
      siblings:['',Validators.required],
      familyType:[1]
    })
  }

  next(){
    this.isSubmitted = true;
    if(this.userFamilyInfoForm.valid){
      this.userFamilyEmitter.emit(this.userFamilyInfoForm.value);
    }

  }
}
