import { AuthService } from './../../../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionService } from './../../../../services/subscription.service';
import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FORM_MODULES } from '../../../../common/common-imports';
import { SubscriptionPlan } from '../../../../models/Subscription/MemberPlan.model';
import { MainUser } from '../../../../models/index.model';
import { BillingInterval } from '../../../../helpers/enum';
import { LoadingComponent } from "../../../../common/loading/loading.component";
declare var Stripe: any;
@Component({
  selector: 'app-stripe-payment',
  imports: [CommonModule, FORM_MODULES, LoadingComponent],
  templateUrl: './stripe-payment.component.html',
  styleUrl: './stripe-payment.component.scss'
})
export class StripePaymentComponent {

  public stripe: any;
  public isStripeLoading:boolean = false;
  private cardNumberElement: any;
  public isCompleteCardNumber: boolean = false;
  private cardCVVElement: any;
  public isCompleteCardCVV: boolean = false;
  private cardExpiryElement: any;
  public isCompleteCardExpiry: boolean = false;
  private cardPostCodeElement: any;
  public isCompleteCardPostCode: boolean = false;
  private _isActiveSubscription: boolean = false;

  public isLoading:boolean = false;
  public clientSecret:string = '';
  public isSubmitted:boolean = false;

  public name:string = '';

  private planId!:string;
  public plan!:SubscriptionPlan;
  public mainUser!:MainUser;
  public subscriptionForm!:FormGroup;

  public billingInterval = BillingInterval;
  constructor(
    private subscriptionService:SubscriptionService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private fb:FormBuilder,
    private authService:AuthService

  ){

  }
  ngOnInit(): void {
    this.planId = this.route.snapshot.paramMap.get('id')!;
    this.subScriptionFormInit();
    this.getSetUpIntent();
    this.getPlan();
    this.getMainUser();

  }

private subScriptionFormInit() {
  this.subscriptionForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    postcode: ['', [Validators.required]],
    country:['',[Validators.required]],
    name:[null]
  });
}


  private initCardElements(cardElements: any){
    this.isStripeLoading = true;
    var inputFieldStyle = {
      style: {
        base: {
          lineHeight: 2,
          fontFamily: '"Raleway", sans-serif',
          fontSize: '15px',
            '::placeholder': {
              color: '#CFD7E0',
            },
        },
      },
    };
    if (!this.cardNumberElement) {
      this.cardNumberElement = cardElements.create('cardNumber', {
        ...inputFieldStyle,
        placeholder: '1234 1234 1234 1234',
        showIcon: true,
      });
      this.cardNumberElement.mount('#floatingNumber');
      this.cardNumberElement.on('change', (event: any) => {
        this.isCompleteCardNumber = event.complete;
      });
    };
    if (!this.cardCVVElement) {
      this.cardCVVElement = cardElements.create('cardCvc', {
        ...inputFieldStyle,
        placeholder: 'CVV',
      });
      this.cardCVVElement.mount('#floatingCvc');
      this.cardCVVElement.on('change', (event: any) => {
        this.isCompleteCardCVV = event.complete;


      });
    };
    if (!this.cardExpiryElement) {
      this.cardExpiryElement = cardElements.create('cardExpiry', {
        ...inputFieldStyle,
        placeholder: 'MM/YY',
      });
      this.cardExpiryElement.mount('#floatingExpiry');
      this.cardExpiryElement.on('change', (event: any) => {
        this.isCompleteCardExpiry = event.complete;

      });
    };
    // if (!this.cardPostCodeElement) {
    //   this.cardPostCodeElement = cardElements.create('postalCode', {
    //     ...inputFieldStyle,
    //     placeholder: '-',
    //   });
    //   this.cardPostCodeElement.mount('#floatingPost');
    //   this.cardPostCodeElement.on('change', (event: any) => {
    //     this.isCompleteCardPostCode = event.complete;
    //   });
    // };
    this.isStripeLoading = false;
  }

  private getSetUpIntent(){
    this.subscriptionService.setUpIntent().subscribe({
      next:(res:any) => {
         this.clientSecret = res.setupIntent.clientSecret;
          this.stripe = Stripe(res.publishableKey);
          const cardElements = this.stripe.elements();
          this.initCardElements(cardElements);
      },
      complete:()=>{},
      error: (error:any) => {
        this.isLoading = false;
        this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
      }
    })
  }

  public confirmPayment(){
    this.isSubmitted = true;
    if(this.subscriptionForm.valid){
       if(this.isCompleteCardNumber && this.isCompleteCardExpiry && this.isCompleteCardCVV) {
       this.isLoading = true;
      this.stripe.confirmCardSetup(this.clientSecret,{payment_method: {card: this.cardNumberElement},})
      .then((result: any) => {
        if (result.error) {
          this.toastr.error(result.error.message, 'Error!');
        } else {
          this._addPaymentMethod(result.setupIntent.payment_method);
        }
      });
     }else{
      this.toastr.error("In complete",'Please fill the card information')
     }
    }else{
      if(!this.subscriptionForm.get('email')?.valid){
        window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
      }

    }
  }

  private _addPaymentMethod(paymentMethodId:string){
    let body = {
      address: this.subscriptionForm.value.address,
      city: this.subscriptionForm.value.city,
      country: this.subscriptionForm.value.country,
      postalCode: this.subscriptionForm.value.postcode,
    }
    this.subscriptionService.confirmPayment(paymentMethodId, body).subscribe({
      next:(res:any)=>{
        console.log(res);
      },
      complete:()=>{
       this._makeSubScription(paymentMethodId);
      },
      error: (error:any) => {
        this.isLoading = false;
        this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
      }
    })
  }

  private _makeSubScription(paymentMethodId:string){
    let body = {
      planId:this.planId,
      paymentMethodId:paymentMethodId,
      isReactive:false
    }
    this.subscriptionService.makeSubscription(body).subscribe({
      next:(res:any)=>{ },
      complete:()=>{
       this.isLoading = false;
       this.toastr.success('Payment method successfully updated', 'Success!');
       this.router.navigateByUrl('member/member-registration');
      },
      error: (error:any) => {
        this.isLoading = false;
        this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
      }
    })
  }

  private getPlan(){
    this.isLoading = true;
    this.subscriptionService.getPlan(this.planId).subscribe({
      next:(res:any)=>{
        console.log(res)
        this.plan = res;
      },
      complete:()=>{
        this.isLoading = false;
      },
      error:(error:any)=>{
        this.isLoading = false;
        this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
      }
    })
  }

  private getMainUser(){
    this.authService.mainUser$.subscribe((res:any)=>{
      this.mainUser = res;
      if(res !== null){
        console.log(res);
       this.subscriptionForm.get('email')?.patchValue(res.email);
       this.subscriptionForm.get('name')?.patchValue(res.firstName + ' ' + res.lastName);
      }
    })
  }


}
