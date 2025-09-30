import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { MemberPlan, SubscriptionPlan as Plan } from '../models/Subscription/MemberPlan.model';
import { MemberCurrentPlan, SubscriptionPlan } from '../models/index.model';
import { CommonResponse } from '../models/commonResponse.model';
import { Invoice } from '../models/Subscription/Invoice.model';

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

  //MEMBER
  public getMemberSubscriptionPlans() {
    return this.http.get(this.baseUrl + 'Subscription/plans').pipe(
      map((res: any) => {
        return  new MemberPlan(res.Result);
      })
    );
  }

  public setUpIntent(){
     return this.http.get(this.baseUrl + `Subscription/setup-intent`).pipe(
      map((res: any) => {
        return res.Result;
      })
    );
  }

  public confirmPayment(paymentMethod:string, body:any){
    return this.http.post(this.baseUrl + `Subscription/add-payment-method/${paymentMethod}`,body);
  }

  public makeSubscription(body:any){
   return this.http.post(this.baseUrl + `Subscription/make-subscription/${body.planId}/${body.paymentMethodId}?isReactive=${body.isReactive}`,{});
  }

  public getPlan(id:string){
     return this.http.get(this.baseUrl + `Subscription/plan/${id}`).pipe(
      map((res: any) => {
        return  new Plan(res.Result);
      })
    );
  }

  public getPlanAndBilling(){
     return this.http.get(this.baseUrl + `Invoice/plan-and-billing`).pipe(
      map((res: any) => {
        return new MemberCurrentPlan(res.Result);
      })
    );
  }

  public getInvoice( pageNumber:number, pageSize:number) {
    return this.http.get(`${this.baseUrl}Invoice/get-all-invoices?&pageNumber=${pageNumber}&pageSize=${pageSize}`).pipe(
      map((res: any) => {
        return new CommonResponse<Invoice>(res.Result, Invoice);
      })
    );
  }

  public getAvailablePlan(){
     return this.http.get(this.baseUrl + `Subscription/available-change-subscription-plans`).pipe(
      map((res: any) => {
        return  new MemberPlan(res.Result);
      })
    );
  }

  public cancelSubscription(id:string){
    return this.http.put<any>(this.baseUrl + `Subscription/cancel-subscription/${id}`, {});
  }

  public changePaymentMethod(paymentMethodId:string, subscriptionIdString:string){
    return this.http.put<any>(this.baseUrl + `Subscription/change-payment-method/${subscriptionIdString}/${paymentMethodId}`,{});
  }

  public switchPlan(newPlanId:number, oldPlanId:number){
    return this.http.put<any>(this.baseUrl + `Subscription/change-subscription?oldSubscriptionType=${oldPlanId}&newSubscriptionType=${newPlanId}`, {});
  }
}
