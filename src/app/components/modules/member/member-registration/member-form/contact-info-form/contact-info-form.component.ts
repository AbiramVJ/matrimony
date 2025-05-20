import { DataProviderService } from './../../../../../../services/data-provider.service';
import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import {
  COMMON_DIRECTIVES,
  FORM_MODULES,
} from '../../../../../../common/common-imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhoneNumberInputComponent } from '../../../../../../common/phone-number-input/phone-number-input.component';
import { residencyStatusList } from '../../../../../../helpers/data';
import {
  UserContactForm,
  UserProfile,
} from '../../../../../../models/index.model';
import { CommonModule } from '@angular/common';
import { MemberService } from '../../../../../../services/member.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-info-form',
  imports: [
    COMMON_DIRECTIVES,
    FORM_MODULES,
    PhoneNumberInputComponent,
    CommonModule,
  ],
  templateUrl: './contact-info-form.component.html',
  styleUrl: './contact-info-form.component.scss',
  standalone: true,
})
export class ContactInfoFormComponent {
  @Output() contactDetailsEmitter = new EventEmitter<any>();
  @Input() isEditFrom: boolean = false;
  @Input() memberProfile!: UserProfile;

  public isSubmitted: boolean = false;
  public userContactFrom!: FormGroup;
  public isLoading: boolean = false;
  public isTemporaryAddress = false;
  private _phoneNumber: string = '';

  public setPhoneNumber!: number;
  public PhoneCode!: string;
  private phoneNumberDetails: any;

  public countryList: any[] = [];
  public selectedCountry: any;
  public selectedTempCountry: any;
  public residencyStatusList = residencyStatusList;
  public selectedTempResidency: number = 1;
  public selectedResidency: number = 1;
  constructor(
    private fb: FormBuilder,
    private dataProvider: DataProviderService,
    private _memberService: MemberService,
    private toastr: ToastrService
  ) {
    this._userContactFromInit();
    this.countryList = this.dataProvider.getPhoneCode();
    effect(() => {
      const userGeoLocationDetails = this.dataProvider.userGeoLocation();
      const defaultCountryCode = this.countryList.find(
        (pc: any) => pc.iso === userGeoLocationDetails?.country_code
      );
      if (defaultCountryCode && !this.isEditFrom) {
        this.selectedCountry = defaultCountryCode.country;
        this.selectedTempCountry = defaultCountryCode.country;
      }
    });
  }

  ngOnInit(): void {}

  private _userContactFromInit() {
    this.userContactFrom = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      doorNumber: [''],
      street: ['', Validators.required],
      city: ['', Validators.required],
      stateProvince: ['', Validators.required],
      residencyStatus: [1, Validators.required],
      zipCode: ['', Validators.required],
      addressType: [0],
      temporaryAddress: this.fb.group({
        doorNumber: [''],
        street: [''],
        city: [''],
        stateProvince: [''],
        residencyStatus: [1],
        zipCode: [''],
        addressType: [1],
      }),
    });
  }

  //PHONE NUMBER
  public getPhoneNumber(event: any) {
    this.phoneNumberDetails = event;
    this._phoneNumber = event.phoneNumber;
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
      addressType: 2,
      residentStatus: this.selectedResidency,
      isDefault: true,
    };

    const temAddress = {
      number: this.userContactFrom.value.temporaryAddress?.doorNumber,
      street: this.userContactFrom.value.temporaryAddress?.street,
      city: this.userContactFrom.value.temporaryAddress?.city,
      state: this.userContactFrom.value.temporaryAddress?.stateProvince,
      zipcode: this.userContactFrom.value.temporaryAddress?.zipCode,
      country: this.selectedTempCountry,
      latitude: 0,
      longitude: 0,
      addressType: 1,
      residentStatus: this.selectedTempResidency,
      isDefault: true,
    };
    const basicDetails = {
      email: this.userContactFrom.value.email,
      phoneNumber: this.userContactFrom.value.phoneNumber ,
      phoneCode: this.phoneNumberDetails ? this.phoneNumberDetails.code : this.memberProfile.phoneCode,
    };

    const formValues = {
      address: [permanentAddress],
      basicDetails: basicDetails,
    };

    if (this.isTemporaryAddress) {
      formValues.address.push(temAddress);
    }

    if (this.userContactFrom.valid) {
      if (!this.isEditFrom) {
        this.contactDetailsEmitter.emit(formValues);
        return;
      } else {
        this.isLoading = true;
        const updatedProfile = {
          ...this.memberProfile,
          email: formValues.basicDetails.email,
          phoneNumber: formValues.basicDetails.phoneNumber,
          profileAddresses: formValues.address,
          phoneCode: formValues.basicDetails.phoneCode,
        };

        this._memberService
          .updateMemberProfile(this.memberProfile.id, updatedProfile)
          .subscribe({
            next: () => {},
            complete: () => {
              this.isLoading = false;
              this.toastr.success('Update successfully', 'success');
            },
            error: (error: any) => {
              this.isLoading = false;
              this.toastr.error(
                error?.error?.Error?.Detail || 'Unknown error',
                error?.error?.Error?.Title || 'Error'
              );
            },
          });
      }
    }
  }

  public addTemAddress() {
    this.isTemporaryAddress = !this.isTemporaryAddress;
    const fields = [
      'city',
      'stateProvince',
      'country',
      'residencyStatus',
      'street',
      'zipCode',
    ];
    fields.forEach((field) => {
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

  public ngOnChanges(): void {
    const permanentAddress = this.memberProfile.profileAddresses?.find(
      (add: any) => add.addressType === 2
    );
    const tempAddress = this.memberProfile.profileAddresses?.find(
      (add: any) => add.addressType === 1
    );
    if (tempAddress) {
      this.isTemporaryAddress = true;
    } else {
      this.isTemporaryAddress = false;
    }

    this.selectedCountry = permanentAddress?.country;
    this.selectedTempCountry = tempAddress?.country;
    this.selectedResidency = permanentAddress?.residentStatus || 1;
    this.selectedTempResidency = tempAddress?.residentStatus || 1;

    this._setPhoneNumberValues();

    this.userContactFrom.patchValue({
      email: this.memberProfile.email,
      phoneNumber: this.memberProfile.phoneNumber,
      doorNumber: permanentAddress?.number || '',
      street: permanentAddress?.street || '',
      city: permanentAddress?.city || '',
      stateProvince: permanentAddress?.state || '',
      residencyStatus: permanentAddress?.residentStatus || 1,
      zipCode: permanentAddress?.zipcode || '',
      addressType: permanentAddress?.addressType || 0,
      temporaryAddress: {
        doorNumber: tempAddress?.number || '',
        street: tempAddress?.street || '',
        city: tempAddress?.city || '',
        stateProvince: tempAddress?.state || '',
        residencyStatus: tempAddress?.residentStatus || 1,
        zipCode: tempAddress?.zipcode || '',
        addressType: tempAddress?.addressType || 3,
      },
    });
  }

  private _setPhoneNumberValues() {
    let selectedCountry = this.countryList.find(
      (c: any) =>
        c.iso?.toLowerCase() === this.memberProfile.phoneCode?.toLowerCase()
    );

    this.PhoneCode = selectedCountry.iso;
    let phoneNumber = this.memberProfile.phoneNumber.split(
      '+' + selectedCountry.code
    );
    this.setPhoneNumber = Number(phoneNumber[1]);
  }
}
