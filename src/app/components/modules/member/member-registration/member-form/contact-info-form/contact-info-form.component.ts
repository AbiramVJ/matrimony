import { DataProviderService } from './../../../../../../services/data-provider.service';
import { Component, effect, EventEmitter, Output } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../../common/common-imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhoneNumberInputComponent } from "../../../../../../common/phone-number-input/phone-number-input.component";
import { residencyStatusList } from '../../../../../../helpers/data';
import { UserContactForm } from '../../../../../../models/index.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-info-form',
  imports: [COMMON_DIRECTIVES, FORM_MODULES, PhoneNumberInputComponent,CommonModule],
  templateUrl: './contact-info-form.component.html',
  styleUrl: './contact-info-form.component.scss',
  standalone:true,
})
export class ContactInfoFormComponent {
  @Output() contactDetailsEmitter = new EventEmitter<any>();
  public isSubmitted:boolean = false;
  public userContactFrom!:FormGroup;
  public isLoading:boolean = false;
  public isTemporaryAddress = false;

  private _phoneNumber:string = '';


  public countryList:any [] = [];
  public selectedCountry:any;
  public selectedTempCountry:any;
  public residencyStatusList = residencyStatusList;
  public selectedTempResidency:number = 1;
  public selectedResidency:number = 1;
  constructor(private fb:FormBuilder,private dataProvider:DataProviderService){
    this._userContactFromInit();
    this.countryList = this.dataProvider.getPhoneCode();
    effect(() => {
      const userGeoLocationDetails = this.dataProvider.userGeoLocation();
      const defaultCountryCode = this.countryList.find((pc:any)=> pc.iso === userGeoLocationDetails?.country_code);
      if(defaultCountryCode){
        this.selectedCountry = defaultCountryCode.country;
        this.selectedTempCountry = defaultCountryCode.country;
      }
    });
  }

  ngOnInit(): void {;
  }

  private _userContactFromInit(){
    this.userContactFrom = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      doorNumber: [''],
      street: ['', Validators.required],
      city: ['', Validators.required],
      stateProvince: ['', Validators.required],
      residencyStatus: [1, Validators.required],
      zipCode:['', Validators.required],
      addressType:[0],
      temporaryAddress: this.fb.group({
        doorNumber: [''],
        street: [''],
        city: [''],
        stateProvince: [''],
        residencyStatus: [1],
        zipCode:[''],
        addressType:[1],
      })
    });
  }

 //PHONE NUMBER
 public getPhoneNumber(event:any){
    this._phoneNumber = event;
    this.userContactFrom.get('phoneNumber')?.setValue(this._phoneNumber);
  }

  public next() {
    this.isSubmitted = true;
    const permanentAddress = {
      number: this.userContactFrom.value.doorNumber,
      street: this.userContactFrom.value.street,
      city: this.userContactFrom.value.city,
      state: this.userContactFrom.value.stateProvince,
      zipcode: this.userContactFrom.value.zipCode,
      country: this.selectedCountry,
      latitude: 0,
      longitude: 0,
      addressType: 1,
      residentStatus: this.selectedResidency,
      isDefault: true
    };

    const temAddress = {
      number: this.userContactFrom.value.temporaryAddress?.doorNumber,
      street: this.userContactFrom.value.temporaryAddress?.street,
      city: this.userContactFrom.value.temporaryAddress?.city,
      state: this.userContactFrom.value.temporaryAddress?.stateProvince,
      zipcode: this.userContactFrom.value.temporaryAddress?.zipCode,
      country: this.selectedCountry,
      latitude: 0,
      longitude: 0,
      addressType: 2,
      residentStatus: this.selectedTempResidency,
      isDefault: true
    };

    const basicDetails = {
      email: this.userContactFrom.value.email,
      phoneNumber: this.userContactFrom.value.phoneNumber
    };

    const formValues = {
      address: [permanentAddress],
      basicDetails: basicDetails
    };

    if (this.isTemporaryAddress) {
      formValues.address.push(temAddress);
    }

    if (this.userContactFrom.valid) {
      this.contactDetailsEmitter.emit(formValues);
    }
  }


  public addTemAddress() {
    this.isTemporaryAddress = !this.isTemporaryAddress;
    const fields = ['city', 'stateProvince', 'country', 'residencyStatus','street','zipCode'];
    fields.forEach(field => {
      const control = this.userContactFrom.get(`temporaryAddress.${field}`);
      if (control) {
        if (!this.isTemporaryAddress) {
          control.clearValidators();
        } else {
          control.addValidators(Validators.required);
        }
        control.updateValueAndValidity();
      }
    });
  }

}
