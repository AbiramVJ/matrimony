
import { SubscriptionService } from './../../../../services/subscription.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FORM_MODULES } from '../../../../common/common-imports';
import { MemberPlan } from '../../../../models/Subscription/MemberPlan.model';
import { MemberCurrentPlan } from '../../../../models/index.model';

@Component({
  selector: 'app-billing',
  imports: [CommonModule,FORM_MODULES],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent {

  public plans: any[] = [1,2,4];
  public correctPlan!:MemberCurrentPlan;

  constructor(private subscriptionService:SubscriptionService){

  }
  ngOnInit(): void {
    this.getPlanAndBilling();
  }

  private getPlanAndBilling(){
    this.subscriptionService.getPlanAndBilling().subscribe({
      next:(res:any)=>{
        this.correctPlan = res;
      }
    })
  }
}
