import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  public getLoginClientToken(clientData:any){
    return this.http.get(this.baseUrl + `Client/client-token?name=${clientData.name}&secretKey=${clientData.secretKey}`).pipe(
      map((res: any) => {
        console.log(res);
        return new TokenResult(res.Result);
      })
    );
  }

}
