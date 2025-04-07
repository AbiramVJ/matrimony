import { matrimonyAgentConfig, matrimonyMemberConfig } from './../../../helpers/util';
import { Component, OnInit } from '@angular/core';
import { FORM_MODULES, ROUTER_MODULES } from '../../../common/common-imports';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SocialFirebaseResponse, TokenResult } from '../../../models/index.model';
import { LoginType, ResetPasswordStep } from '../../../helpers/enum';
import { DataProviderService } from '../../../services/data-provider.service';
import { SocialLoginService } from '../../../services/auth/social-login.service';
import { fbAppId } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [FORM_MODULES, CommonModule, ROUTER_MODULES, FORM_MODULES],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private _agentClientData = matrimonyAgentConfig.clientData;
  private _memberClientData = matrimonyMemberConfig.clientData;
  private _resetToken:string = '';
  private _verifyToken:string = '';


  public isLoading:boolean = false;
  public isSubmitted:boolean = false;
  public isLogin:boolean = true;
  public isAgent:boolean = false;
  public isSingUp:boolean = false;
  public isMatchPwd:boolean = true;
  public isEmailLogin:boolean = true;
  public isForgotSubmitted:boolean = false;

  public step:number = 1;
  public length: number = 4;

  public loginForm!:FormGroup;
  public signUpForm!:FormGroup;
  public forgotForm!:FormGroup;
  public otpForm!:FormGroup;
  public passwordResetForm!:FormGroup;

  public inputControls: string[] = [];
  public clientToken: string = '';

  public resetStep = ResetPasswordStep;
  public phoneCodes:any = [];
  public selectedCode:any;
  public allPhoneCodes: any[] = [];
  public passwordStrength = {
    value: 0,
    text: 'None',
    class: ''
  };
  constructor(
    private auth:AuthService,
    private router:Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataProvider:DataProviderService,
    private SocialLogin:SocialLoginService

  ){}
  ngOnInit(): void {
    this.getLoginClientToken();
    this._loginFormInit();
    this._signInFormInit();
    this._forgotFormInit();
    this._otpFormInit();
    this._restPwdFormsInit();
    this._getPhoneNumberCode();
    this.allPhoneCodes = [...this.phoneCodes];
    this.selectedCode = this.phoneCodes[0].code;
  }

  private _loginFormInit(){
    this.loginForm = this.formBuilder.group({
      email:[null,[Validators.required,]],
      password:[null,[Validators.required,Validators.minLength(8)]],
    })
  }

  private _signInFormInit(){
    this.signUpForm = this.formBuilder.group({
      firstName:[null,[Validators.required]],
      lastName:[null,[Validators.required]],
      email:[null,[Validators.required, Validators.email,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,50}$/)]],
      password:[null,[Validators.required,Validators.minLength(8)]],
      phoneNumber:[null,[Validators.required]]
    })
  }

  private _forgotFormInit(){
    this.forgotForm = this.formBuilder.group({
      email:[null,[Validators.required,]],
    })
  }

  private _getPhoneNumberCode(){
    this.phoneCodes = this.dataProvider.getPhoneCode();
  }

  private _otpFormInit(){
    this.otpForm = this.formBuilder.group({});
    this.inputControls = Array(this.length).fill('').map((_, i) => `otp-${i}`);
    const otpControls: any = {};
    this.inputControls.forEach(controlName => {
      otpControls[controlName] = ['', [Validators.required, Validators.pattern('^[0-9]$')]];
    });

    this.otpForm = this.formBuilder.group(otpControls);
    this.otpForm.valueChanges.subscribe(() => {
      const otp = this.getOtpValue();
      if (this.otpForm.valid && otp.length === this.length) {
       // this.otpCompleted.emit(otp);
      }
    });
  }

  private _restPwdFormsInit(){
    this.passwordResetForm = this.formBuilder.group({
      password:[null,[Validators.required,Validators.minLength(8)]],
      confirmPassword:[null,[Validators.required,Validators.minLength(8)]],
    })
  }

  //CLIENT TOKEN
  public getLoginClientToken() {
    this.clientToken = '';
    this.isLoading = true;

    this.auth.getLoginClientToken(this.isAgent ? this._agentClientData : this._memberClientData).subscribe({
      next:(response:TokenResult)=>{
        this.clientToken = response.token;
      },
      complete:() =>{
        this.isLoading = false;
      },
      error:(error:any) =>{
        this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
      }
    });
  }

  public changeLoginType(){
    this.isAgent = !this.isAgent;
    this.loginForm.reset();
    this.signUpForm.reset();
    this.isSubmitted = false;
    this.getLoginClientToken();
  }

  //SING UP
  public signUp(){
    this.isSubmitted = true;
    if(this.signUpForm.valid){
      this.isLoading = true;
      const body = this.signUpForm.value;
      body['loginType'] = this.isEmail(body.email) ? 1 : 1;
      const pn = '+' + this.selectedCode + body.phoneNumber;
      delete body.phoneNumber;
      body['phoneNumber'] = pn;
      this.auth.signUp(this.signUpForm.value, this.clientToken).subscribe({
        next:(res:any)=>{
          this.auth.setAuthToken(res.Result.token);
          this.auth.setUser();
        },
        complete:()=>{
          this.isLoading = false;
          this.router.navigateByUrl('home');
        },
        error:(error:any)=>{
          this.isLoading = false;
          this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
        }
      })
    }
  }

  public login(){
    this.isSubmitted = true;
    const body = this.loginForm.value;
    body['loginType'] = this.isEmail(body.email) ? 1 : 1;
    if(this.loginForm.valid){
      this.isLoading = true;
      this.auth.login(body,this.clientToken).subscribe({
        next:(res:any) => {
          this.auth.setAuthToken(res.Result.token);
          this.auth.setUser();
        },
        complete:()=>{
          this.isLoading = false;
          this.router.navigateByUrl('home');
        },
        error:(error:any)=>{
          this.isLoading = false;
          this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
        }
      })
    }
  }

  public loginWithGoogle(){
    this.SocialLogin.signInWithGoogle()
      .then((result:SocialFirebaseResponse) => {
        this._makeSocialLogin(result, true);
      })
      .catch(error => {
        this.toastr.error(error.detail, 'Error!');
        console.log(error);
      })
  }



  public loginWithFacebook() {
    this.SocialLogin.signInWithFacebook()
      .then((result: SocialFirebaseResponse) => {
        this._makeSocialLogin(result, false);
      })
      .catch(error => {

      });
  }

  private _makeSocialLogin(result:SocialFirebaseResponse, isGoogle:boolean){
    const body =
      {
        loginType: isGoogle ? LoginType.Google :LoginType.Facebook ,
        socialToken: isGoogle ? result.socialToken : result.accessToken,
        socialClientId: isGoogle ? '' : fbAppId,
        firstName:result.firstName,
        lastName:result.lastName,
      }
    this.auth.socialLogin(body, this.clientToken).subscribe((res:any) => {
      console.log(res);
    })
  }

  public loginWithPhoneNumber(value:boolean){
    this.isEmailLogin = value;
  }

  private isEmail(input: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
  }


  public sendOtp(){
    const body = this.forgotForm.value;
    this.isForgotSubmitted = true;
    if(this.forgotForm.valid){
      this.isLoading = true;
      this.auth.forgotPassword(true,this.clientToken,body.email).subscribe({
        next:(res:TokenResult)=>{
          this._resetToken = res.token;
        },
        complete:()=>{
          this.isLoading = false;
          this.isForgotSubmitted = false;
          this.step = this.resetStep.verification;
        },
        error:(error:any)=>{
          this.isLoading = false;
          this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
        }
      })
    }
  }
  public backToStep(){
    if(this.step = this.resetStep.verification){
      this.step = this.resetStep.enterEmail;
    }else if(this.step = this.resetStep.resetPassword ){
      this.step = this.resetStep.verification;
    }
  }

  public verifyOtp(){
    if(this.otpForm.valid){
      this.isLoading = true;
      const otpString = Object.values(this.otpForm.value).join('');
      const body ={
        token: this._resetToken,
        otpCode: Number(otpString)
      }
      this.auth.verifyOtp(body, this.clientToken).subscribe({
        next:(res:any)=>{
          this._verifyToken = res.Result.token;
        },
        complete:() => {
          this.step = this.resetStep.resetPassword;
          this.isLoading = false;
        },
        error:(error:any)=>{
          this.otpForm.reset();
          const firstInput = document.querySelector('.otp-input') as HTMLElement;
          if (firstInput) {
            setTimeout(() => firstInput.focus(), 50);
          }
          this.isLoading = false;
          this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
        }
      })
    }

  }

  public createPassword(){
    const pwdValues = this.passwordResetForm.value;
    if(pwdValues.password === pwdValues.confirmPassword ){
      this.isLoading = true;
      this.isSubmitted = true;
      this.isMatchPwd = true;
      const body = {
        token:this._verifyToken,
        newPassword:pwdValues.password
      }
      this.auth.createPassword(body, this.clientToken).subscribe({
        next:(res:any)=>{
          this.auth.setAuthToken(res.Result.token);
          this.auth.setUser();
        },
        complete:()=>{
          var retryPop: HTMLElement = document.getElementById('close-btn') as HTMLElement;
          if(retryPop) {
            retryPop.click();
          }
          this.isLoading = false;
          this.router.navigateByUrl('home');
        },
        error:(error:any)=>{
          this.isLoading = false;
          this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
        }
      })
    }else{
      this.isMatchPwd = false;
    }
  }

  public onInputChange() {
    this.isMatchPwd = true;
  }

  trackByFn(index: number): number {
    return index;
  }

  onInput(event: any, index: number): void {
    const input = event.target;
    const value = input.value;

    if (value && value.length === 1 && /^\d$/.test(value)) {
      if (index < this.length - 1) {
        const nextInput = input.nextElementSibling;
        if (nextInput) {
          nextInput.focus();
        }
      }

      const allFilled = this.inputControls.every(control =>
        this.otpForm.get(control)?.value?.length === 1
      );

      if (allFilled) {
        const otp = this.inputControls
          .map(control => this.otpForm.get(control)?.value)
          .join('');

        this.verifyOtp();
      }
    } else {
      // Clear invalid input
      this.otpForm.get(this.inputControls[index])?.setValue('');
    }
  }


  public onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    if (!event.clipboardData) {
      return;
    }
    const pastedData = event.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').split('').slice(0, this.length);

    if (digits.length > 0) {
      digits.forEach((digit, i) => {
        if (i < this.length) {
          this.otpForm.get(this.inputControls[i])?.setValue(digit);
        }
      });
      const focusIndex = Math.min(digits.length, this.length - 1);
      const inputElements = document.querySelectorAll('.otp-input');
      if (inputElements && inputElements[focusIndex]) {
        (inputElements[focusIndex] as HTMLInputElement).focus();
      }
    }
  }

  public onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      if (input.value === '') {
        if (index > 0) {
          const prevInput = input.previousElementSibling as HTMLInputElement;
          if (prevInput) {
            prevInput.focus();
            prevInput.select();
          }
        }
      }
    } else if (event.key === 'ArrowLeft') {
      if (index > 0) {
        const prevInput = input.previousElementSibling as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
          prevInput.select();
        }
      }
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      if (index < this.length - 1) {
        const nextInput = input.nextElementSibling as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      }
      event.preventDefault();
    }
  }

  public getOtpValue(): string {
    if (!this.otpForm || !this.otpForm.value) {
      return '';
    }
    return this.inputControls
      .map(controlName => this.otpForm.get(controlName)?.value || '')
      .join('');
  }

  public clear(): void {
    this.inputControls.forEach(controlName => {
      this.otpForm.get(controlName)?.setValue('');
    });
    const firstInput = document.querySelector('.otp-input') as HTMLInputElement;
    if (firstInput) {
      firstInput.focus();
    }
  }

  public formsReset(){
    this.forgotForm.reset();
    this.otpForm.reset();
    this.passwordResetForm.reset();
    this.isSubmitted = false;
    this.step = this.resetStep.enterEmail;
  }

  onSearchChange(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
      this.phoneCodes = [...this.allPhoneCodes];
      return;
    }
    this.phoneCodes = this.allPhoneCodes.filter(item =>
      item.country.toLowerCase().includes(searchTerm) ||
      item.code.includes(searchTerm)
    );
  }


  public updatePasswordStrength(isSignUp = true): void {
    let password = null;
    isSignUp ? password = this.signUpForm.get('password')?.value : this.passwordResetForm.get('confirmPassword')?.value;
    this.passwordStrength = { value: 0, text: 'None', class: '' };
    if (!password || password.length === 0) return;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    this.passwordStrength.value = strength;
    if (strength < 30) {
      this.passwordStrength.class = 'bg-danger';
      this.passwordStrength.text = 'Weak';
    } else if (strength < 60) {
      this.passwordStrength.class = 'bg-warning';
      this.passwordStrength.text = 'Fair';
    } else if (strength < 80) {
      this.passwordStrength.class = 'bg-info';
      this.passwordStrength.text = 'Good';
    } else {
      this.passwordStrength.class = 'bg-success';
      this.passwordStrength.text = 'Excellent';
    }
  }

  public changeSignUpStatus(){
    this.isSingUp = true;
    this.loginForm.reset();
    this.isSubmitted = false;
    this.passwordStrength = {
      value: 0,
      text: 'None',
      class: ''
    };
  }

  public changeSignInStatus(){
    this.isSingUp = false ;
    this.signUpForm.reset();
    this.isSubmitted = false;
    this.passwordStrength = {
      value: 0,
      text: 'None',
      class: ''
    };
  }

}


