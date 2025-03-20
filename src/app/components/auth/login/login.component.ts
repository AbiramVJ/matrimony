import { clientData, matrimonyAgentConfig, matrimonyMemberConfig } from './../../../helpers/util';
import { routes } from './../../../app.routes';
import { Component, OnInit } from '@angular/core';
import { FORM_MODULES, ROUTER_MODULES } from '../../../common/common-imports';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { matrimonyConfig } from '../../../helpers/util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TokenResult } from '../../../models/index.model';
import { SvgIconComponent } from 'angular-svg-icon';
import { ResetPasswordStep } from '../../../helpers/enum';
@Component({
  selector: 'app-login',
  imports: [FORM_MODULES, CommonModule, ROUTER_MODULES, FORM_MODULES,SvgIconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private _clientTokenData = matrimonyConfig.clientData;
  private _agentClientData = matrimonyAgentConfig.clientData;
  private _memberClientData = matrimonyMemberConfig.clientData;
  private _resetToken = '';


  public isLoading:boolean = false;
  public isSubmitted:boolean = false;
  public isLogin:boolean = true;
  public isAgent:boolean = false;
  public isSingUp:boolean = false;
  public isMatchPwd:boolean = true;
  public step:number = 1;
  public length: number = 4;

  public loginForm!:FormGroup;
  public signUpForm!:FormGroup;
  public forgotForm!:FormGroup;
  public otpForm!:FormGroup;
  public passwordReset!:FormGroup;

  public inputControls: string[] = [];
  public clientToken: string = '';

  public resetStep = ResetPasswordStep;

  constructor(
    private auth:AuthService,
    private router:Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,

  ){}
  ngOnInit(): void {
    this._loginFormInit();
    this.getLoginClientToken();
    this._signInFormInit();
    this._forgotFormInit();
    this._otpFormInit();
    this._restPwdFormsInit();
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
    this.passwordReset = this.formBuilder.group({
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
    this.getLoginClientToken();
  }

  //SING UP
  public signUp(){
    this.isSubmitted = true;
    if(this.signUpForm.valid){
      this.isLoading = true;
      const body = this.signUpForm.value;
      body['loginType'] = this.isEmail(body.email) ? 1 : 2;
      console.log(this.clientToken);
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
    body['loginType'] = this.isEmail(body.email) ? 1 : 2;
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

  private isEmail(input: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  }

  public sendOtp(){
    const body = this.forgotForm.value;
    if(this.forgotForm.valid){
      this.isLoading = true;
      this.auth.forgotPassword(this.isEmail(body.email),this.clientToken,body.email).subscribe({
        next:(res:TokenResult)=>{
          this._resetToken = res.token;
        },
        complete:()=>{
          this.isLoading = false;
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
      this.step = this.resetStep.resetPassword;
      this.isLoading = true;
      const otpString = Object.values(this.otpForm.value).join('');
      this.auth.verifyOtp(otpString, this.clientToken).subscribe({
        next:(res:any)=>{
          console.log(res);
        },
        complete:() => {
          this.step = this.resetStep.resetPassword;
          this.isLoading = false;
        },
        error:(error:any)=>{
          this.isLoading = false;
          this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
        }
      })
    }

  }

  public createPassword(){
    const pwdValues = this.passwordReset.value;
    if(pwdValues.password === pwdValues.confirmPassword ){
      this.isLoading = true;
      this.isSubmitted = true;
      this.isMatchPwd = true;
      this.auth.createPassword(pwdValues.password, this.clientToken).subscribe({
        next:()=>{

        },
        complete:()=>{
          this.isLoading = false;
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
      // Move to next input if not the last one
      if (index < this.length - 1) {
        const nextInput = input.nextElementSibling;
        if (nextInput) {
          nextInput.focus();
        }
      }
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
    this.passwordReset.reset();
    this.isSubmitted = false;
    this.step = this.resetStep.enterEmail;
  }

}
