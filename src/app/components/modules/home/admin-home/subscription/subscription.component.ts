import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SubscriptionService } from '../../../../../services/subscription.service';
import { SubscriptionPlan } from '../../../../../models/index.model';
import { BillingInterval, SubscriptionType } from '../../../../../helpers/enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FORM_MODULES } from '../../../../../common/common-imports';
import { billingIntervalsList, subscriptionTypeList } from '../../../../../helpers/data';

@Component({
  selector: 'app-subscription',
  imports: [CommonModule,FORM_MODULES],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent {

  public plans: SubscriptionPlan[] = [];
  public isLoading: boolean = false;
  public subscriptionType = SubscriptionType;
  public billingInterval = BillingInterval;
  public subscriptionForm!: FormGroup;
  public billingIntervalsList = billingIntervalsList;
  public subscriptionTypeList = subscriptionTypeList;
  public isUpdate:boolean = false;
  public updatePlanId!:string;
  public deletePlanId!:string;

  constructor(private subscriptionService: SubscriptionService, private toastr: ToastrService, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.loadSubscriptionPlans();
    this.subscriptionFormInit();
  }

  private subscriptionFormInit() {
    this.subscriptionForm = this.fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      intervalType: [null, [Validators.required]],
      isActive: [false],
      trialPeriodDays: [0, [Validators.required, Validators.min(0)]],
      subscriptionType: [null, [Validators.required]],
      memberCount: [1, [Validators.required, Validators.min(1)]],
      sendFriendRequestCount: [1, [Validators.required, Validators.min(0)]],
      interval:[null,[Validators.required]]
    });
  }

  private loadSubscriptionPlans() {
    this.isLoading = true;
    this.subscriptionService.getSubscriptionPlans().subscribe({
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

  public createSubscriptionPlan() {
    if (this.subscriptionForm.invalid) {
      this.toastr.error('Please fill in all required fields correctly.');
      return;
    }
    this.isLoading = true;
    const newPlan = this.subscriptionForm.value;
    this.subscriptionService.createSubscriptionPlan(newPlan).subscribe({
      next: (res: any) => {
        this.toastr.success('Subscription plan created successfully.');
        this.subscriptionForm.reset();
        let viewModal: HTMLElement = document.getElementById('sub-modal-btn') as HTMLElement;
        if (viewModal) { viewModal.click();}
      },
      complete: () => {
        this.loadSubscriptionPlans();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.toastr.error(error.error.Error.Detail, error.error.Error.Title);
        this.isLoading = false;
      }
    });
  }

  public editSubscription(){
    this.subscriptionForm.markAllAsTouched();
    if (this.subscriptionForm.invalid) {
      this.toastr.error('Please fill in all required fields correctly.');
      return;
    }
    this.isLoading = true;
    const updatedPlan = this.subscriptionForm.value;
    this.subscriptionService.editSubscriptionPlan(updatedPlan, this.updatePlanId).subscribe({
      next: (res: any) => {
        this.toastr.success('Subscription plan updated successfully.');
        this.subscriptionForm.reset();
      },
      complete: () => {
        this.loadSubscriptionPlans();
        this.isLoading = false;
        this.isUpdate = false;
        let viewModal: HTMLElement = document.getElementById('sub-modal-btn') as HTMLElement;
        if (viewModal) { viewModal.click(); }
      },
      error: (error: any) => {
        this.toastr.error(error.error.Error.Detail, error.error.Error.Title);
        this.isLoading = false;
      }
    });
  }

  public deleteSubscriptionPlan() {
    this.isLoading = true;
    this.subscriptionService.deleteSubscriptionPlan(this.deletePlanId).subscribe({
      next: (res: any) => {
        this.toastr.success('Subscription plan deleted successfully.');
      },
      complete: () => {
        this.loadSubscriptionPlans();
        this.deletePlanId = '';
        this.isLoading = false;
        let viewModal: HTMLElement = document.getElementById('deleted-close-btn') as HTMLElement;
        if (viewModal) { viewModal.click(); }
      },
      error: (error: any) => {
        this.toastr.error(error.error.Error.Detail, error.error.Error.Title);
        this.isLoading = false;
      }
    });
  }

  public editSubscriptionPlan(plan: SubscriptionPlan) {
    this.subscriptionForm.patchValue(plan);
    this.isUpdate = true;
    this.updatePlanId = plan.id;
    let viewModal: HTMLElement = document.getElementById('sub-modal-btn') as HTMLElement;
    if (viewModal) { viewModal.click(); }
  }
}
