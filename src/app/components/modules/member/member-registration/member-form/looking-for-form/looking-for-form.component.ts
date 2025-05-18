import { MemberService } from './../../../../../../services/member.service';
import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataProviderService } from '../../../../../../services/data-provider.service';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../../common/common-imports';
import { LookingForList } from '../../../../../../helpers/data';
import { MatchPreferences, UserProfile } from '../../../../../../models/index.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-looking-for-form',
  imports: [FORM_MODULES,COMMON_DIRECTIVES],
  templateUrl: './looking-for-form.component.html',
  styleUrl: './looking-for-form.component.scss'
})
export class LookingForFormComponent {
  @Output() userMatchingDetailsEmitter = new EventEmitter<MatchPreferences>();
  // @Input() UserMatchingSetData!:MatchPreferences;
  @Input() isEditFrom:boolean = false;
  @Input() memberProfile!:UserProfile;
  public lookingForList:any = LookingForList;
  public countryList:any [] = [];
  public selectedCountry:any;

  public profileMatchingForm!:FormGroup;

  public SelectedLookingFor:number = 1;
  public selectedMatch:number = 1;

  public isSubmitted:boolean = false;
  public isLoading:boolean = false;
  constructor(
    private _fb:FormBuilder,
    private dataProvider:DataProviderService,
    private _memberService:MemberService,
    private toastr: ToastrService

  ){
    this._matchingProfileFormInit();
    this.countryList = this.dataProvider.getPhoneCode();
    effect(() => {
      const userGeoLocationDetails = this.dataProvider.userGeoLocation();
      const defaultCountryCode = this.countryList.find((pc:any)=> pc.iso === userGeoLocationDetails?.country_code);
      if(defaultCountryCode){
        this.selectedCountry = defaultCountryCode.country;
      }
    });
  }
  private _matchingProfileFormInit(){
    this.profileMatchingForm = this._fb.group({
      gender:[1],
      minAge:['',Validators.required],
      maxAge:['', Validators.required],
    })
  }

  public next(){
    this.isSubmitted = true;
    const formValue = this.profileMatchingForm.value;
    if(this.profileMatchingForm.valid){
      const quesData = {
        profileFor:this.SelectedLookingFor,
        gender:formValue.gender,
        minAge:formValue.minAge,
        maxAge:formValue.maxAge,
        country:this.selectedCountry,
      }
      if(!this.isEditFrom){
       this.userMatchingDetailsEmitter.emit(quesData);
       return;
      }
      else
      {
        this.isLoading = true;
        const updatedProfile = {
          ...this.memberProfile,
          profileFor: quesData.profileFor,
          originCountry: quesData.country,
          profileLookingFor: {
          ...this.memberProfile.profileLookingFor,
          gender: quesData.gender,
          minAge: quesData.minAge,
          maxAge: quesData.maxAge,
        }
      };

        this._memberService.updateMemberProfile(this.memberProfile.id, updatedProfile).subscribe({
          next:(res:any) => {},
          complete:()=>{
            this.isLoading = false;
            this.toastr.success("Update successfully",'success');
          },
          error:(error:any) => {
            this.isLoading = false;
            this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
          }
        })
      }
    }
  }

  public ngOnChanges(){
    if(this.memberProfile){
      this.profileMatchingForm.get('gender')?.patchValue(this.memberProfile.profileLookingFor.gender);
      this.profileMatchingForm.get('minAge')?.patchValue(this.memberProfile.profileLookingFor.minAge);
      this.profileMatchingForm.get('maxAge')?.patchValue(this.memberProfile.profileLookingFor.maxAge);
      this.SelectedLookingFor = this.memberProfile.profileFor;
      this.selectedCountry = this.memberProfile.originCountry;
    }
  }

}
