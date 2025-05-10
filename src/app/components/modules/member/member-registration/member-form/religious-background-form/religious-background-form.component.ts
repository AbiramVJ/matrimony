import { MemberService } from './../../../../../../services/member.service';
import { DataProviderService } from './../../../../../../services/data-provider.service';
import { Component, effect, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../../common/common-imports';
import { Natshathira, raasiList, Religions } from '../../../../../../helpers/data';
import { UserReligiousInfo } from '../../../../../../models/Interface/registrationFrom.interface';
import { Community, SubCommunity } from '../../../../../../models/community.model';
import { Religion } from '../../../../../../models/religion.model';

@Component({
  selector: 'app-religious-background-form',
  imports: [COMMON_DIRECTIVES,FORM_MODULES],
  templateUrl: './religious-background-form.component.html',
  styleUrl: './religious-background-form.component.scss'
})
export class ReligiousBackgroundFormComponent {
  @Output() userReligiousEmitter = new EventEmitter<UserReligiousInfo>();
  public userReligiousForm!:FormGroup;
  public religionList:Religion [] = [];
  public selectedReligions:string = '';

  public isSubmitted:boolean = false;
  public isLoading:boolean = false;

  public countryList:any [] = [];
  public selectedCountry:any;

  public natshathiraList = Natshathira;
  public selectedStar:number = 1;

  public rasiList = raasiList;
  public selectedRaasi:number = 1;

  public communityList:Community[] = [];
  public selectedCommunity:string = '';

  public SubCommunityList:SubCommunity[] = [];
  public selectedSubCommunity:string = '';

  constructor(private fb:FormBuilder, private dataProvider:DataProviderService, private memberService:MemberService){
    this._userReligiousFormInit();
    this.countryList = this.dataProvider.getPhoneCode();
    effect(() => {
      const userGeoLocationDetails = this.dataProvider.userGeoLocation();
      const defaultCountryCode = this.countryList.find((pc:any)=> pc.iso === userGeoLocationDetails?.country_code);
      if(defaultCountryCode){
        this.selectedCountry = defaultCountryCode.iso;
      }
    });
  }

  ngOnInit(): void {
    this._getCommunity();
    this._getReligion();
  }

  private _getCommunity(){
    this.isLoading = true;
    this.memberService.getCommunity().subscribe({
      next:(res:Community[]) => {
        this.communityList = res;
        this.SubCommunityList = res[0].subCommunities;
        this.selectedCommunity = res[0].id;
        this.selectedSubCommunity = res[0].subCommunities[0].id;
      },
      complete:() => {
        this.isLoading = false;
      },
      error:(error:Error) => {
        this.isLoading = false;
      }
    })
  }

    private _getReligion(){
    this.isLoading = true;
    this.memberService.getReligion().subscribe({
      next:(res:Religion[]) => {
        this.religionList = res;
        this.selectedReligions = res[0].id;
      },
      complete:() => {
        this.isLoading = false;
      },
      error:(error:Error) => {
        this.isLoading = false;
      }
    })
  }

  public changeCommunity(): void {
  const selectedCommunity = this.communityList.find(
    (community: Community) => community.id === this.selectedCommunity
  );

  this.SubCommunityList = selectedCommunity?.subCommunities ?? [];
}




  private _userReligiousFormInit(){
    this.userReligiousForm = this.fb.group({
      religion:[''],
      communityCast:[''],
      timeOfBirth:['', Validators.required],

      subCast:[''],
      starNakshathra:[''],
      raasi:[''],



      city: ['',Validators.required],
      stateProvince: ['',Validators.required],
      country: [''],
    })
  }

  public next(){
    this.isSubmitted = true;
    console.log(this.userReligiousForm.valid)
    console.log(this.userReligiousForm.value)
    const formValue = this.userReligiousForm.value;
    const data = {
      religion:this.selectedReligions ,
      communityCast:this.selectedCommunity ,
      timeOfBirth:formValue.timeOfBirth ,
      subCast: this.selectedSubCommunity ,
      starNakshathra:this.selectedStar ,
      raasi:this.selectedRaasi ,
      chevvaiDosham:formValue.chevvaiDosham ,
      horoscopeMatching:formValue.horoscopeMatching ,
      city:formValue.city ,
      stateProvince:formValue.stateProvince ,
      country:this.selectedCountry ,
    }
    if(this.userReligiousForm.valid){
      this.userReligiousEmitter.emit(data);
    }
  }

}
