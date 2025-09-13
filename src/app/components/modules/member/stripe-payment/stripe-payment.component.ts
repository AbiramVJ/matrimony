import { ActivatedRoute } from '@angular/router';
import { SubscriptionService } from './../../../../services/subscription.service';

import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
declare var Stripe: any;
@Component({
  selector: 'app-stripe-payment',
  imports: [CommonModule],
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

  private planId!:string;
  constructor(private subscriptionService:SubscriptionService,
    private route: ActivatedRoute,
      private toastr: ToastrService,
  ){

  }
  ngOnInit(): void {
    this.getSetUpIntent();
    this.planId = this.route.snapshot.paramMap.get('id')!;
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
    if (!this.cardPostCodeElement) {
      this.cardPostCodeElement = cardElements.create('postalCode', {
        ...inputFieldStyle,
        placeholder: '-',
      });
      this.cardPostCodeElement.mount('#floatingPost');
      this.cardPostCodeElement.on('change', (event: any) => {
        this.isCompleteCardPostCode = event.complete;
      });
    };
    this.isStripeLoading = false;
  }

  private getSetUpIntent(){
    this.subscriptionService.setUpIntent().subscribe({
      next:(res:any) => {
        console.log(res);
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
    this.isLoading = true;
    console.log(this.clientSecret)
    this.stripe.confirmCardSetup(this.clientSecret,{payment_method: {card: this.cardNumberElement},})
    .then((result: any) => {
      if (result.error) {
        this.toastr.error(result.error.message, 'Error!');
      } else {
        this._addPaymentMethod(result.setupIntent.payment_method);
      }
    });
  }

  private _addPaymentMethod(paymentMethodId:string){
    this.subscriptionService.confirmPayment(paymentMethodId).subscribe({
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
      },
      error: (error:any) => {
        this.isLoading = false;
        this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
      }
    })
  }


}
