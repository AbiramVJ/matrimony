import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FORM_MODULES } from '../common-imports';
import { CommonModule } from '@angular/common';
import { DataProviderService } from '../../services/data-provider.service';


@Component({
  selector: 'app-phone-number-input',
  imports: [FORM_MODULES,CommonModule],
  templateUrl: './phone-number-input.component.html',
  styleUrl: './phone-number-input.component.scss'
})


export class PhoneNumberInputComponent {
  @Input() isSubmitted:boolean = false;
  @Output() phoneNumberEmitter = new EventEmitter<any>();

  public phoneCodes:any = [];
  public selectedCode:any;
  public allPhoneCodes: any[] = [];
  public phoneNumber:any;
  public isValidPn:boolean = true;

  constructor( private dataProvider:DataProviderService,){

  }

  ngOnInit(): void {
    this._getPhoneNumberCode();
    this.allPhoneCodes = [...this.phoneCodes];
    this.selectedCode = this.phoneCodes[0].code;

  }

  ngOnChanges(): void {
    this.isValidPn = this.isValidPhoneNumber(this.phoneNumber);
  }

  private _getPhoneNumberCode(){
    this.phoneCodes = this.dataProvider.getPhoneCode();
  }

  onSearchChange(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
      this.phoneCodes = [...this.allPhoneCodes];
      return;
    }
    this.phoneCodes = this.allPhoneCodes.filter(item =>
      item.country.toLowerCase().includes(searchTerm) ||
      item.code.includes(searchTerm)
    );
  }

  emitPhoneNumber(){
    let isValid = this.isValidPhoneNumber(this.phoneNumber);
    if(isValid){
      this.isValidPn = true;
      let pn = '';
      pn = '%2B' + this.selectedCode + this.phoneNumber;
      this.phoneNumberEmitter.emit(pn);
    }else{
      this.isValidPn = false;
    }

  }

  isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\d{8,}$/;
    return phoneRegex.test(phone);
  }



}
