import { DataProviderService } from './../../../../../../services/data-provider.service';
import { Component, effect, EventEmitter, Output } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../../common/common-imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhoneNumberInputComponent } from "../../../../../../common/phone-number-input/phone-number-input.component";
import { residencyStatusList } from '../../../../../../helpers/data';
import { UserContactForm } from '../../../../../../models/index.model';

@Component({
  selector: 'app-contact-info-form',
  imports: [COMMON_DIRECTIVES, FORM_MODULES, COMMON_DIRECTIVES, PhoneNumberInputComponent],
  templateUrl: './contact-info-form.component.html',
  styleUrl: './contact-info-form.component.scss',
  standalone:true,
})
export class ContactInfoFormComponent {
  @Output() contactDetailsEmitter = new EventEmitter<UserContactForm>();
  public isSubmitted:boolean = false;
  public userContactFrom!:FormGroup;
  public isLoading:boolean = false;

  private _phoneNumber:string = '';


  public countryList:any [] = [];
  public selectedCountry:any;
  public residencyStatusList = residencyStatusList;

  constructor(private fb:FormBuilder,private dataProvider:DataProviderService){
    this._userContactFromInit();
    this.countryList = this.dataProvider.getPhoneCode();
    effect(() => {
      const userGeoLocationDetails = this.dataProvider.userGeoLocation();
      const defaultCountryCode = this.countryList.find((pc:any)=> pc.iso === userGeoLocationDetails?.country_code);
      if(defaultCountryCode){
        this.selectedCountry = defaultCountryCode.iso;
      }
    });
  }

  ngOnInit(): void {;
  }

  private _userContactFromInit(){
    this.userContactFrom = this.fb.group({
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      city: ['', Validators.required],
      stateProvince: ['', Validators.required],
      country: [''],
      address: ['', Validators.required],
      residencyStatus: [1, Validators.required],
      addressType:['permanent',Validators.required]
    });
  }

 //PHONE NUMBER
 public getPhoneNumber(event:any){
    this._phoneNumber = event;
    this.userContactFrom.get('phoneNumber')?.setValue(this._phoneNumber);
  }

  public next(){
    this.isSubmitted = true;
    console.log(this.userContactFrom.value);
    this.userContactFrom.get('country')?.setValue(this.selectedCountry);
    if(this.userContactFrom.valid){
      this.contactDetailsEmitter.emit(this.userContactFrom.value);
    }
  }
}
