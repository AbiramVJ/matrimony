import { Component, EventEmitter, Output } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../../common/common-imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { bodyTypes, diet, knownLanguages, motherTongue, yesOrNo } from '../../../../../../helpers/data';
import { PersonalDetails } from '../../../../../../models/index.model';

@Component({
  selector: 'app-personal-details-form',
  imports: [COMMON_DIRECTIVES, FORM_MODULES],
  templateUrl: './personal-details-form.component.html',
  styleUrl: './personal-details-form.component.scss'
})
export class PersonalDetailsFormComponent {
  @Output() personalDetailsEmitter = new EventEmitter<PersonalDetails>();
  public userPersonalDetailsForm!:FormGroup;
  public isSubmitted = false;
  public motherTongueList:any = motherTongue;
  public selectedMotherTongue = 1;
  public dietList = diet;
  public selectedDiet = 1;

  public yesOrNoList = yesOrNo;
  public selectedDrinking = 1;
  public selectedSmoke = 1;

  public knownLanguagesList = knownLanguages;
  public selectedKnowLanguage = 1;

  public bodyTypeList = bodyTypes;
  public selectedBodyType = 1;
  constructor(private fb:FormBuilder){
    this._userPersonalInfoFormInit();
  }

  private _userPersonalInfoFormInit(){
    this.userPersonalDetailsForm = this.fb.group({
      aboutMe:['', Validators.required],
      disability:['', Validators.required],
      motherTongue:[''],
      diet:[],
      smoking:[],
      drinking:[],
      languages:[[]],
      bodyType:[],
      canReLocated:[1]
    })
  }

  public next(){
    this.isSubmitted = true
    const formsValue = this.userPersonalDetailsForm.value;
    const personalDetailsValue:PersonalDetails = {
      aboutMe:formsValue.aboutMe,
      disability:formsValue.disability,
      motherTongue:this.selectedMotherTongue,
      diet:this.selectedDiet,
      smoking:this.selectedSmoke,
      drinking:this.selectedDrinking,
      languages:this.selectedKnowLanguage,
      bodyType:this.selectedBodyType,
      canReLocated:formsValue.canReLocated
    }
    if(this.userPersonalDetailsForm.valid){
      this.personalDetailsEmitter.emit(personalDetailsValue);
    }
  }
}
