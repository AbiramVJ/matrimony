import { Component } from '@angular/core';
import { TopBarComponent } from "../../../../../common/top-bar/top-bar.component";
import { MemberProfileFormComponent } from "./member-profile-form/member-profile-form.component";
import { FormBuilder } from '@angular/forms';
import { UserBasicForm, UserContactForm } from '../../../../../models/index.model';
import { Router } from '@angular/router';
import { COMMON_DIRECTIVES } from '../../../../../common/common-imports';
import { MemberRegistrationStep } from '../../../../../helpers/enum';
import { ContactInfoFormComponent } from "./contact-info-form/contact-info-form.component";



@Component({
  selector: 'app-member-form',
  imports: [TopBarComponent, MemberProfileFormComponent, COMMON_DIRECTIVES, ContactInfoFormComponent],
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
    console.log(event);
  }

  public goBack(){
    if(this.currentStep === this.steps.basic){
      this.route.navigateByUrl('member/profiles');
      return;
    }else if(this.currentStep === this.steps.contact){
      this.currentStep = this.steps.basic;
    }

  }
}
