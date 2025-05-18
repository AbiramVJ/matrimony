import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataProviderService } from '../../../../../../services/data-provider.service';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../../common/common-imports';
import { LookingForList } from '../../../../../../helpers/data';
import { MatchPreferences } from '../../../../../../models/index.model';

@Component({
  selector: 'app-looking-for-form',
  imports: [FORM_MODULES,COMMON_DIRECTIVES],
  templateUrl: './looking-for-form.component.html',
  styleUrl: './looking-for-form.component.scss'
})
export class LookingForFormComponent {
  @Output() userMatchingDetailsEmitter = new EventEmitter<MatchPreferences>();
  @Input() UserMatchingSetData!:MatchPreferences;
  public lookingForList:any = LookingForList;
  public countryList:any [] = [];
  public selectedCountry:any;

  public profileMatchingForm!:FormGroup;

  public SelectedLookingFor:number = 1;
  public selectedMatch:number = 1;

  public isSubmitted:boolean = false;
  constructor(private _fb:FormBuilder,
    private dataProvider:DataProviderService){
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
      this.userMatchingDetailsEmitter.emit(quesData);
    }
  }

  public ngOnChanges(){
    this.profileMatchingForm.get('gender')?.patchValue(this.UserMatchingSetData.gender);
    this.profileMatchingForm.get('minAge')?.patchValue(this.UserMatchingSetData.minAge);
    this.profileMatchingForm.get('maxAge')?.patchValue(this.UserMatchingSetData.maxAge);
    this.SelectedLookingFor = this.UserMatchingSetData.profileFor;
    this.selectedCountry = this.UserMatchingSetData.country;
  }
  public setFormData(){

  }
}
