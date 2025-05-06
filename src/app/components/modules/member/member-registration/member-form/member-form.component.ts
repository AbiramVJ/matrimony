import { Component } from '@angular/core';
import { TopBarComponent } from "../../../../../common/top-bar/top-bar.component";
import { MemberProfileFormComponent } from "./member-profile-form/member-profile-form.component";
import { FormBuilder } from '@angular/forms';
import { UserBasicForm, UserContactForm } from '../../../../../models/index.model';
import { Router } from '@angular/router';
import { COMMON_DIRECTIVES } from '../../../../../common/common-imports';
import { MemberRegistrationStep } from '../../../../../helpers/enum';
import { ContactInfoFormComponent } from "./contact-info-form/contact-info-form.component";
import { PersonalDetailsFormComponent } from "./personal-details-form/personal-details-form.component";



@Component({
  selector: 'app-member-form',
  imports: [TopBarComponent, MemberProfileFormComponent, COMMON_DIRECTIVES, ContactInfoFormComponent, PersonalDetailsFormComponent],
  templateUrl: './member-form.component.html',
  styleUrl: './member-form.component.scss'
})
export class MemberFormComponent {

  public currentStep:number = 2;
  public steps = MemberRegistrationStep;

  constructor(private route:Router){

  }

  public getUserBasicDetailsEmitter(event:UserBasicForm){
    this.currentStep = MemberRegistrationStep.contact;
  }

  public getUserContactDetailsEmitter(event:UserContactForm){
    this.currentStep = MemberRegistrationStep.personal;
    console.log(event);
  }

  public goBack(){
    if(this.currentStep === this.steps.basic){
      this.route.navigateByUrl('member/profiles');
      return;
    }else if(this.currentStep === this.steps.contact){
      this.currentStep = this.steps.basic;
    }else if(this.currentStep === this.steps.personal){
      this.currentStep = this.steps.contact;
    }

  }
  getProgressWidth(): string {
    if (this.currentStep === this.steps.contact) {
      return '25%';
    } else if (this.currentStep === this.steps.personal) {
      return '50%';
    }
    //  else if (this.currentStep === this.steps.review) {
    //   return '75%';
    // } else if (this.currentStep === this.steps.confirm) {
    //   return '100%';
    // }
    return '0%';
  }

}
