import { AuthService } from './../../../../../services/auth/auth.service';
import { MemberService } from '../../../../../services/member.service';
import { Component } from '@angular/core';
import { MemberProfileFormComponent } from "./member-profile-form/member-profile-form.component";
import { MatchPreferences, PersonalDetails, UserBasicForm, UserContactForm, UserDetails, UserEducationDetails, UserFamilyInfo, UserReligiousInfo } from '../../../../../models/index.model';
import { ActivatedRoute, Router } from '@angular/router';
import { COMMON_DIRECTIVES } from '../../../../../common/common-imports';
import { MemberRegistrationStep } from '../../../../../helpers/enum';
import { ContactInfoFormComponent } from "./contact-info-form/contact-info-form.component";
import { PersonalDetailsFormComponent } from "./personal-details-form/personal-details-form.component";
import { FamilyInformationFormComponent } from "./family-information-form/family-information-form.component";
import { ReligiousBackgroundFormComponent } from "./religious-background-form/religious-background-form.component";
import { EducationDetailsFormComponent } from "./education-details-form/education-details-form.component";
import { LookingForFormComponent } from "./looking-for-form/looking-for-form.component";
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-member-form',
  imports: [MemberProfileFormComponent, COMMON_DIRECTIVES, ContactInfoFormComponent, PersonalDetailsFormComponent, FamilyInformationFormComponent, ReligiousBackgroundFormComponent, EducationDetailsFormComponent, LookingForFormComponent],
  templateUrl: './member-form.component.html',
  styleUrl: './member-form.component.scss'
})
export class MemberFormComponent {

  public questionData:any;
  public currentStep:number = 0;
  public steps = MemberRegistrationStep;

  public matchingInfo!:MatchPreferences;
  public userBasicDetails!:UserBasicForm;
  public userContactDetails!:any;
  public userPersonalDetails!:PersonalDetails;
  public userFamilyDetails!:UserFamilyInfo;
  public userEducationDetails!:UserEducationDetails;
  public UserReligiousDetails!:UserReligiousInfo;

  public userDetails!:UserDetails;

  public userAddressList:any [] = [];
  public isLoading:boolean = false;

  public isEditFlow:boolean = true;

  constructor(private route:Router,private activeRoute: ActivatedRoute, private _memberService:MemberService, private   AuthService:AuthService,private toastr: ToastrService){
  }

  ngOnInit(): void {
    this.getProfileQusData();
    this.userDetails = this.AuthService.getTokenDecodeData();
  }


  public getProfileQusData(){
    this.questionData = this._memberService.getQuestionData();
  }

  public getUserLookingForDetails(event:MatchPreferences){
    this.matchingInfo = event;
    this.currentStep = MemberRegistrationStep.basic;
    this.scrollToTop();
  }
  public getUserBasicDetailsEmitter(event:UserBasicForm){
    this.currentStep = MemberRegistrationStep.contact;
    this.userBasicDetails = event;
    this.scrollToTop();
  }

  public getUserContactDetailsEmitter(event:UserContactForm){
    this.userAddressList.push(event.address[0]);
    if(event.address[1]){
      this.userAddressList.push(event.address[1]);
    }
    this.userContactDetails = event;
    this.currentStep = MemberRegistrationStep.personal;
    this.scrollToTop();
  }

  public getUserPersonalDetailsEmitter(event:PersonalDetails){
    this.currentStep = MemberRegistrationStep.family;
    this.userPersonalDetails = event;
    this.scrollToTop();
  }

  public getUserFamilyDetailsEmitter(event:UserFamilyInfo){
    this.currentStep = MemberRegistrationStep.religionBackground;
    this.userFamilyDetails = event;
    this.scrollToTop();
  }

  public getUserReligiousEmitter(event:UserReligiousInfo){
    this.UserReligiousDetails = event;
    this.userAddressList.push(this.UserReligiousDetails.address);
    this.currentStep = MemberRegistrationStep.education;
  }

  public getEducationDetails(event:UserEducationDetails){
    this.userEducationDetails = event;
    this.scrollToTop();

   // this.route.navigateByUrl('member/profiles');
   // this.currentStep = MemberRegistrationStep.complete;
     this._prePareUserPostBody()
  }

  public goBack(){
    if(this.currentStep === this.steps.lookingFor){
      this.route.navigateByUrl('home/member');
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

  public getProgressWidth(): string {
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
  }

private scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


  private _prePareUserPostBody(){
    const body = {
      profileFor: this.matchingInfo?.profileFor,
      isActive: true,
      firstName: this.userBasicDetails?.firstName,
      lastName: this.userBasicDetails?.lastName,
      email:this.userContactDetails?.basicDetails.email ,
      phoneNumber:this.userContactDetails?.basicDetails.phoneNumber ,
      phoneCode:this.userContactDetails?.basicDetails.phoneCode,
      aboutMe: this.userPersonalDetails?.aboutMe,
      gender: this.userBasicDetails?.gender,
      dateOfBirth: this.userBasicDetails?.dateOfBirth,
      foodHabit: this.userPersonalDetails?.diet,
      drinksHabit: this.userPersonalDetails?.drinking,
      smokeHabit: this.userPersonalDetails?.smoking,
      marriageStatus: this.userBasicDetails?.maritalStatus,
      bodyType: this.userPersonalDetails?.bodyType,
      willingToRelocate: this.userPersonalDetails?.canReLocated,
      height: this.userBasicDetails?.height,
      weight: this.userBasicDetails?.weight,
      disability: this.userPersonalDetails?.disability,
      originCountry: null,
      motherTongue: this.userPersonalDetails?.motherTongue,
      knownLanguages:this.userPersonalDetails.languages,
      bloodGroup:this.userPersonalDetails?.bloodGroup,
      userId: this.userDetails?.UserId,
      religionId: this.UserReligiousDetails?.religion,
      communityId: this.UserReligiousDetails?.communityCast,
      subCommunityId: this.UserReligiousDetails?.subCast,
      isVisibleCommunity: this.UserReligiousDetails?.isVisible,
      skinComplexion:this.userPersonalDetails.complexion,
      profileJob: {
        title: this.userEducationDetails?.jobTitle,
        companyName: this.userEducationDetails?.companyName,
        sector: this.userEducationDetails?.sector,
        jobTypeId: this.userEducationDetails?.jobType,
        profileSalary: {
          isAnnual: this.userEducationDetails?.isYearly,
          amount: this.userEducationDetails?.salaryDetails,
          currencyCode: this.userEducationDetails?.currency,
          isVisible: this.userEducationDetails?.isVisible,
        }
      },
      profileLookingFor: {
        gender: this.matchingInfo?.gender,
        minAge: this.matchingInfo?.minAge,
        maxAge: this.matchingInfo?.maxAge,
        country: this.matchingInfo?.country
      },
      profileFamily: {
        fatherName: this.userFamilyDetails?.fatherName,
        fatherOccupation: this.userFamilyDetails?.fatherOccupation,
        motherName: this.userFamilyDetails?.motherName,
        motherOccupation: this.userFamilyDetails?.matherOccupation,
        numberOfSiblings: this.userFamilyDetails?.siblings,
        familyType: this.userFamilyDetails?.familyType
      },
      profileAstrology: {
        nakshathiram: this.UserReligiousDetails?.starNakshathra,
        raasi: this.UserReligiousDetails?.raasi,
        timeOfBirth: this.UserReligiousDetails?.timeOfBirth,
      },
      profileImages: this.userBasicDetails?.profilesImg,
      profileAddresses: this.userAddressList,
      profileEducations: [
        {
          qualification: this.userEducationDetails?.qualification,
          institute: this.userEducationDetails?.institute,
          sortNo: 0,
          educationQualificationId: this.userEducationDetails?.highestEducation,
        }
      ]
    }

    this._createUser(body);
  }

  private _createUser(body:any){
    this.isLoading = true;
    this._memberService.createProfile(body).subscribe({
      next:(res:any)=>{
         this.toastr.success('Successful',`Profile created`)
      },
      complete:()=>{
        this.isLoading = false;
        this.route.navigateByUrl('home/member');
      },
      error:(error:any)=>{
        this.isLoading = false;
        this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
      }
    })
  }

}
