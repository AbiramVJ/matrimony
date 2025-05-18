import { MemberService } from './../../../../../services/member.service';
import { AuthService } from './../../../../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES, ROUTER_MODULES } from '../../../../../common/common-imports';
import { MatchPreferences, PersonalDetails, UserBasicForm, UserContactForm, UserEducationDetails, UserFamilyInfo, UserProfile, UserReligiousInfo } from '../../../../../models/index.model';
import { ToastrService } from 'ngx-toastr';
import { MemberRegistrationStep } from '../../../../../helpers/enum';
import { LookingForFormComponent } from "../member-form/looking-for-form/looking-for-form.component";
import { MemberProfileFormComponent } from "../member-form/member-profile-form/member-profile-form.component";
import { ContactInfoFormComponent } from "../member-form/contact-info-form/contact-info-form.component";
import { PersonalDetailsFormComponent } from "../member-form/personal-details-form/personal-details-form.component";
import { FamilyInformationFormComponent } from "../member-form/family-information-form/family-information-form.component";
import { ReligiousBackgroundFormComponent } from "../member-form/religious-background-form/religious-background-form.component";
import { EducationDetailsFormComponent } from "../member-form/education-details-form/education-details-form.component";
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-member-edit-form',
  imports: [FORM_MODULES, ROUTER_MODULES, COMMON_DIRECTIVES, LookingForFormComponent, MemberProfileFormComponent, ContactInfoFormComponent, PersonalDetailsFormComponent, FamilyInformationFormComponent, ReligiousBackgroundFormComponent, EducationDetailsFormComponent, UpperCasePipe],
  templateUrl: './member-edit-form.component.html',
  styleUrl: './member-edit-form.component.scss'
})
export class MemberEditFormComponent {

  public isLoading:boolean = false;
  public memberProfile!:UserProfile;
  public memberId:string = '' ;
  public matchingInfo!:MatchPreferences;
  public userBasicDetails!:UserBasicForm;
  public userContactDetails!:any;
  public userPersonalDetails!:PersonalDetails;
  public userFamilyDetails!:UserFamilyInfo;
  public userEducationDetails!:UserEducationDetails;
  public UserReligiousDetails!:UserReligiousInfo;

  public currentStep:number = 0;
  public steps = MemberRegistrationStep;
  public userMatchingSetData!:MatchPreferences;
  constructor(private activatedRoute:ActivatedRoute,
    private _memberService:MemberService,
    private toastr: ToastrService
  ){
    this.memberId = this.activatedRoute.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(){
    this._getMemberProfile();
  }

  private _getMemberProfile(){
   this.isLoading = true;
   this._memberService.getMemberProfileById(this.memberId).subscribe({
    next:(res:any)=>{
     this.memberProfile = res;
    },
    complete:()=>{
      this.isLoading = false;
      this.changeStep(this.steps.lookingFor);
    },
    error:(error:any) => {
      this.isLoading = false;
      this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
    }
   })
  }

   public getUserLookingForDetails(event:MatchPreferences){
    this.matchingInfo = event;
   // this.currentStep = MemberRegistrationStep.basic;
  }
  public getUserBasicDetailsEmitter(event:UserBasicForm){
     // this.currentStep = MemberRegistrationStep.contact;
    //  this.userBasicDetails = event;
    //  this.scrollToTop();
    }

    public getUserContactDetailsEmitter(event:UserContactForm){
      // this.userAddressList.push(event.address[0]);
      // if(event.address[1]){
      //   this.userAddressList.push(event.address[1]);
      // }
      // this.userContactDetails = event;
      // this.currentStep = MemberRegistrationStep.personal;
      // this.scrollToTop();
    }

    public getUserPersonalDetailsEmitter(event:PersonalDetails){
      // this.currentStep = MemberRegistrationStep.family;
      // this.userPersonalDetails = event;
      // this.scrollToTop();
    }

    public getUserFamilyDetailsEmitter(event:UserFamilyInfo){
      // this.currentStep = MemberRegistrationStep.religionBackground;
      // this.userFamilyDetails = event;
      // this.scrollToTop();
    }

    public getUserReligiousEmitter(event:UserReligiousInfo){
      // this.UserReligiousDetails = event;
      // this.userAddressList.push(this.UserReligiousDetails.address);
      // this.currentStep = MemberRegistrationStep.education;
    }

    public getEducationDetails(event:UserEducationDetails){
    //   this.userEducationDetails = event;
    //   this.scrollToTop();

    //  // this.route.navigateByUrl('member/profiles');
    //  // this.currentStep = MemberRegistrationStep.complete;
    //    this._prePareUserPostBody()
    }

    public changeStep(step:number){
      this.currentStep = step;
      if(this.currentStep === this.steps.lookingFor){
        const quesData = {
        profileFor:this.memberProfile.profileFor,
        gender:this.memberProfile.profileLookingFor.gender,
        minAge:this.memberProfile.profileLookingFor.minAge,
        maxAge:this.memberProfile.profileLookingFor.maxAge,
        country:this.memberProfile.originCountry,
        }

        this.userMatchingSetData = quesData;
      }
    }


}
