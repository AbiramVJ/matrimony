import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { SubscriptionPlan } from '../models/index.model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private baseUrl = (environment as any).baseUrl;
  constructor(private http: HttpClient) {}

  public getSubscriptionPlans() {
    return this.http.get(this.baseUrl + 'SubscriptionSetup').pipe(
      map((res: any) => {
        return res.Result.map((data: any) => new SubscriptionPlan(data));
      })
    );
  }

  public createSubscriptionPlan(plan: any) {
    return this.http.post<any>(this.baseUrl + 'SubscriptionSetup', plan);
  }

  public editSubscriptionPlan(plan: any, id:string) {
    return this.http.put<any>(this.baseUrl + 'SubscriptionSetup/' +id, plan);
  }

  public deleteSubscriptionPlan(id: string) {
    return this.http.delete<any>(this.baseUrl + 'SubscriptionSetup/' + id);
  }

}
