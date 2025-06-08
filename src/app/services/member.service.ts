import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { Community, Education, FullUserProfile, MainUser, MemberProfile, Religion, UserProfile } from '../models/index.model';
import { CommonResponse } from '../models/commonResponse.model';


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

  private filterSource = new BehaviorSubject<any>(null);
  filter$ = this.filterSource.asObservable();

  setFilter(data: any) {
    this.filterSource.next(data);
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

   public updateMemberProfile(id:string, body:any){
    return this.http.put<any>(this.baseUrl + `profile/${id}`, body);
  }

  public deleteMember(id:string) {
    return this.http.delete<any>(this.baseUrl + `Profile/${id}`);
  }

  public getMatchingData(body: any, id: string, pageNumber:number, pageSize:number) {
    return this.http.post(`${this.baseUrl}ProfileMatching/matching/${id}?&pageNumber=${pageNumber}&pageSize=${pageSize}`, body).pipe(
      map((res: any) => {
        return new CommonResponse<MemberProfile>(res.Result, MemberProfile);
      })
    );
  }

  public GetFilterMemberViewData(id:string){
    return this.http.get(this.baseUrl + `ProfileMatching/view/${id}`).pipe(
        map((res: any) => {
          return new FullUserProfile(res.Result);
      })
    );
  }

  public getMainUser(){
    return this.http.get(this.baseUrl + 'User').pipe(
        map((res: any) => {
          return new MainUser(res.Result);
      })
    );
  }

}
