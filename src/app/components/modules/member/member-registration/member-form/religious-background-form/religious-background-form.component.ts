import { DataProviderService } from './../../../../../../services/data-provider.service';
import { Component, effect, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../../common/common-imports';
import { Religions } from '../../../../../../helpers/data';
import { UserReligiousInfo } from '../../../../../../models/Interface/registrationFrom.interface';

@Component({
  selector: 'app-religious-background-form',
  imports: [COMMON_DIRECTIVES,FORM_MODULES],
  templateUrl: './religious-background-form.component.html',
  styleUrl: './religious-background-form.component.scss'
})
export class ReligiousBackgroundFormComponent {
  @Output() userReligiousEmitter = new EventEmitter<UserReligiousInfo>();
  public userReligiousForm!:FormGroup;
  public religionList =  Religions;
  public selectedReligions:number = 1;
  public selectedCommunity:number = 1;
  public selectedSubcaste:number = 1;
  public selectedStar:number = 1;
  public selectedRaasi:number = 1;

  public isSubmitted:boolean = false;

  public countryList:any [] = [];
  public selectedCountry:any;

  constructor(private fb:FormBuilder, private dataProvider:DataProviderService){
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
      subCast: this.selectedSubcaste ,
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
