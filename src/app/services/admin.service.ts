import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenResult } from '../models/clientToken.model';
import { clientData } from '../helpers/util';

import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = (environment as any).baseUrl;
  constructor(private http: HttpClient) { }

  public GetAdminClientToken(){
    return this.http.get(this.baseUrl + `Client/client-token?name=${clientData.ADMIN.name}&secretKey=${clientData.ADMIN.secretKey}`).pipe(
        map((res: any) => {
          return new TokenResult(res.Result);
        })
      );
  }

  //LOGIN
  public login(body:any, clientToken:string){
    const headers = this._getHeader(clientToken);
    return this.http.post<any>(this.baseUrl + 'Auth/login', body, { 'headers': headers });
  }

  //HEDER
  private _getHeader(clientToken:string){
    const headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Authorization', `Bearer ${clientToken}`);
    return headers;
  }

}
