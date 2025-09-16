import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SubscriptionService } from '../../../../services/subscription.service';
import { FORM_MODULES } from '../../../../common/common-imports';
import { CommonModule } from '@angular/common';
import { billingIntervalsList, subscriptionTypeList } from '../../../../helpers/data';
import { BillingInterval, SubscriptionType } from '../../../../helpers/enum';
import { MemberPlan } from '../../../../models/Subscription/MemberPlan.model';
import { StripePaymentComponent } from "../stripe-payment/stripe-payment.component";
import { Router } from '@angular/router';
import { TopBarComponent } from "../../../../common/top-bar/top-bar.component";



@Component({
  selector: 'app-subscription-plan',
  imports: [FORM_MODULES, CommonModule, TopBarComponent],
  templateUrl: './subscription-plan.component.html',
  styleUrl: './subscription-plan.component.scss'
})
export class SubscriptionPlanComponent {
  public isLoading: boolean = false;
  public plans!: MemberPlan;
  public billingInterval = BillingInterval;
  public billingIntervalsList = billingIntervalsList;
  public subscriptionTypeList = subscriptionTypeList;
  public subscriptionType = SubscriptionType;

  public isMovedPayment:boolean = true;



  constructor(private subscriptionService: SubscriptionService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadSubscriptionPlans();
  }

  private loadSubscriptionPlans() {
    this.isLoading = true;
    this.subscriptionService.getMemberSubscriptionPlans().subscribe({
      next:(res:any)=>{
        this.plans = res;
        console.log('Subscription plans loaded:', this.plans);
      },
      complete: () => {
        this.isLoading = false;
      },
      error: (error:any) => {
        this.isLoading = false;
        this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
      }
    })
  }

  public moveToPayment(id:string){
    this.router.navigateByUrl(`member/payment/${id}`);
  }

}
