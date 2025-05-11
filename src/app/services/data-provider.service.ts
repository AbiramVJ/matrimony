import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { countryCode } from '../helpers/data';
import { IpLocation } from '../models/index.model';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
private baseUrl = (environment as any).baseUrl;
private phoneNumberCodes = countryCode;
public userGeoLocation = signal<IpLocation | null>(null);

  constructor(private http: HttpClient) { }

  public getPhoneCode(){
    return this.phoneNumberCodes;
  }

  public getUserGeoLocation(){
    this.http.get<any>('https://ipapi.co/json/')
    .subscribe((data:IpLocation) => {
      this.userGeoLocation.set(data);
    });
  }

}
