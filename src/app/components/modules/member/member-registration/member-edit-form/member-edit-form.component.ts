import { MemberService } from './../../../../../services/member.service';
import { AuthService } from './../../../../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
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
import { LoadingComponent } from "../../../../../common/loading/loading.component";

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

  public userBasicDetails!:UserBasicForm;
  public userContactDetails!:any;
  public userPersonalDetails!:PersonalDetails;
  public userFamilyDetails!:UserFamilyInfo;
  public userEducationDetails!:UserEducationDetails;
  public UserReligiousDetails!:UserReligiousInfo;

  public currentStep:number = 0;
  public steps = MemberRegistrationStep;
  public userMatchingSetData!:MatchPreferences;
  public memberBasicDetails!:UserBasicForm;

  stepList = [
  { key: this.steps.lookingFor, label: 'Matching' },
  { key: this.steps.basic, label: 'Personal Info' },
  { key: this.steps.contact, label: 'Contact' },
  { key: this.steps.personal, label: 'Personal' },
  { key: this.steps.family, label: 'Family' },
  { key: this.steps.religionBackground, label: 'Religious' },
  { key: this.steps.education, label: 'Education' }
];

  constructor(private activatedRoute:ActivatedRoute,
    private _memberService:MemberService,
    private toastr: ToastrService,
    private route:Router,
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
      //this.changeStep(this.steps.lookingFor);
    },
    error:(error:any) => {
      this.isLoading = false;
      this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
    }
   })
  }

  public changeStep(step:number){
    this._getMemberProfile();
    this.currentStep = step;
  }

  public goBack(){
    this.route.navigateByUrl('member/profiles');
  }


}
