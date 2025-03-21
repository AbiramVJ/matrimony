import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { countryCode } from '../helpers/data';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
private baseUrl = (environment as any).baseUrl;
private phoneNumberCodes = countryCode;
  constructor(private http: HttpClient) { }

  public getPhoneCode(){
    return this.phoneNumberCodes;
  }
}
