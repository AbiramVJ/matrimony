import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenResult } from '../../models/index.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = (environment as any).baseUrl;

  constructor(private http: HttpClient) { }

  public googleLogin(token: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/google-login`, { token });
  }

  // GET CLIENT TOKEN
  public getLoginClientToken(clientData:any){
    return this.http.get(this.baseUrl + `Client/client-token?name=${clientData.name}&secretKey=${clientData.secretKey}`).pipe(
      map((res: any) => {
        return new TokenResult(res.Result);
      })
    );
  }

  public signUp(body:any, clientToken:any){
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', `Bearer ${clientToken}`);
    return this.http.post<any>(this.baseUrl + 'Auth/register', body, { 'headers': headers });
  }

  public login(body:any,clientToken:string){
    const headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Authorization', `Bearer ${clientToken}`);
    return this.http.post<any>(this.baseUrl + 'Auth/login', body, { 'headers': headers });
  }

  public setAuthToken(token: string) {
    console.log(token);
    localStorage.setItem('token', token);
  }

  public getAuthToken() {
    return localStorage.getItem('token');
  }

  public removeAuthToken() {
    localStorage.removeItem('token');
  }

  public setUser(loginType:number){
    localStorage.setItem('loginType', loginType.toString());
  }

  public getUserType(){
    return localStorage.getItem('token');
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }



}
