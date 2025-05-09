import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

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

}
