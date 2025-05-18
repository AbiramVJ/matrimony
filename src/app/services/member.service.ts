import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Community, Education, Religion, UserProfile } from '../models/index.model';


@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private baseUrl = (environment as any).baseUrl;
  public profileQuestionData:any;

  constructor(private http: HttpClient) { }

  public setQuestionData(data:any){
    this.profileQuestionData = data;
  }

  public getQuestionData() : any{
   return this.profileQuestionData;
  }

  public uploadImageToBulb(body:any){
    return this.http.post<any>(this.baseUrl + 'Data/upload-file', body);
  }

  public getCommunity(){
    return this.http.get(this.baseUrl + 'Community').pipe(
        map((res: any) => {
          return res.Result.data.map((data:any) => new Community(data));
      })
    );
  }

  public getReligion(){
    return this.http.get(this.baseUrl + 'Religion').pipe(
        map((res: any) => {
          return res.Result.data.map((data:any) => new Religion(data));
      })
    );
  }

  public getEducationQualification(){
     return this.http.get(this.baseUrl + 'EducationQualification').pipe(
        map((res: any) => {
          return res.Result.data.map((data:any) => new Education(data));
      })
    );
  }

   public getJobType(){
     return this.http.get(this.baseUrl + 'JobType').pipe(
        map((res: any) => {
          return res.Result.data.map((data:any) => new Education(data));
      })
    );
  }

  public createProfile(body:any){
    return this.http.post<any>(this.baseUrl + 'profile', body);
  }

  public getProfiles(){
    return this.http.get(this.baseUrl + 'Profile/user').pipe(
        map((res: any) => {
          return res.Result.map((data:any) => new UserProfile(data));
      })
    );
  }

  public getMemberProfileById(id:string){
  return this.http.get(this.baseUrl + `Profile/${id}`).pipe(
        map((res: any) => {
          return new UserProfile(res.Result);
      })
    );
  }
}
