import { MemberService } from '../../../../../services/member.service';
import { Component } from '@angular/core';
import { TopBarComponent } from "../../../../../common/top-bar/top-bar.component";
import { MemberProfileFormComponent } from "./member-profile-form/member-profile-form.component";
import { MatchPreferences, PersonalDetails, UserBasicForm, UserContactForm, UserEducationDetails, UserFamilyInfo, UserReligiousInfo } from '../../../../../models/index.model';
import { Router } from '@angular/router';
import { COMMON_DIRECTIVES } from '../../../../../common/common-imports';
import { MemberRegistrationStep } from '../../../../../helpers/enum';
import { ContactInfoFormComponent } from "./contact-info-form/contact-info-form.component";
import { PersonalDetailsFormComponent } from "./personal-details-form/personal-details-form.component";
import { FamilyInformationFormComponent } from "./family-information-form/family-information-form.component";
import { ReligiousBackgroundFormComponent } from "./religious-background-form/religious-background-form.component";
import { EducationDetailsFormComponent } from "./education-details-form/education-details-form.component";
import { LookingForFormComponent } from "./looking-for-form/looking-for-form.component";


@Component({
  selector: 'app-member-form',
  imports: [TopBarComponent, MemberProfileFormComponent, COMMON_DIRECTIVES, ContactInfoFormComponent, PersonalDetailsFormComponent, FamilyInformationFormComponent, ReligiousBackgroundFormComponent, EducationDetailsFormComponent, LookingForFormComponent],
  templateUrl: './member-form.component.html',
  styleUrl: './member-form.component.scss'
})
export class MemberFormComponent {

  public questionData:any;
  public currentStep:number = 0;
  public steps = MemberRegistrationStep;

  constructor(private route:Router, private _memberService:MemberService){

  }

  ngOnInit(): void {
    this.getProfileQusData();
  }


  public getProfileQusData(){
    this.questionData = this._memberService.getQuestionData();
    console.log(this.questionData);
  }

  public getUserLookingForDetails(event:MatchPreferences){
    this.currentStep = MemberRegistrationStep.basic;
  }
  public getUserBasicDetailsEmitter(event:UserBasicForm){
    this.currentStep = MemberRegistrationStep.contact;
  }

  public getUserContactDetailsEmitter(event:UserContactForm){
    this.currentStep = MemberRegistrationStep.personal;

  }

  public getUserPersonalDetailsEmitter(event:PersonalDetails){
    this.currentStep = MemberRegistrationStep.family;
  }

  public getUserFamilyDetailsEmitter(event:UserFamilyInfo){
    this.currentStep = MemberRegistrationStep.religionBackground;
  }

  public getUserReligiousEmitter(event:UserReligiousInfo){
    this.currentStep = MemberRegistrationStep.education;
  }

  public getEducationDetails(event:UserEducationDetails){
    this.route.navigateByUrl('member/profiles');
    this.currentStep = MemberRegistrationStep.complete;
  }

  public goBack(){
    if(this.currentStep === this.steps.lookingFor){
      this.route.navigateByUrl('member/profiles');
      return;
    }else if(this.currentStep === this.steps.basic){
      this.currentStep = this.steps.lookingFor;
      return;
    }else if(this.currentStep === this.steps.contact){
      this.currentStep = this.steps.basic;
      return;
    }else if(this.currentStep === this.steps.personal){
      this.currentStep = this.steps.contact;
      return;
    }else if(this.currentStep === this.steps.family){
      this.currentStep = this.steps.personal;
      return;
    }else if(this.currentStep === this.steps.religionBackground){
      this.currentStep = this.steps.family;
      return;
    }else if(this.currentStep === this.steps.family){
      this.currentStep = this.steps.religionBackground;
      return;
    }else if(this.currentStep === this.steps.education){
      this.currentStep = this.steps.religionBackground;
      return;
    }
  }

  getProgressWidth(): string {
    if(this.currentStep === this.steps.lookingFor){
      return '0%';
    }else if (this.currentStep === this.steps.basic) {
      return '15%';
    }
    else if (this.currentStep === this.steps.contact) {
      return '30%';
    } else if (this.currentStep === this.steps.personal) {
      return '45%';
    }else if (this.currentStep === this.steps.family){
      return '65%';
    }else if(this.currentStep === this.steps.religionBackground){
      return '70%';
    }else{
      return '85%';
    }
    //  else if (this.currentStep === this.steps.review) {
    //   return '75%';
    // } else if (this.currentStep === this.steps.confirm) {
    //   return '100%';
    // }
  }

}
