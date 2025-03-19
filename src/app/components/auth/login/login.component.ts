import { clientData, matrimonyAgentConfig } from './../../../helpers/util';
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
@Component({
  selector: 'app-login',
  imports: [FORM_MODULES, CommonModule, ROUTER_MODULES, FORM_MODULES],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private _clientTokenData = matrimonyConfig.clientData;
  private _agentClientData = matrimonyAgentConfig.clientData;
  public clientToken: string = '';

  public isLoading:boolean = false;
  public isSubmitted:boolean = false;
  public isLogin:boolean = true;
  public isAgent:boolean = false;
  public isSingUp:boolean = false;

  public loginForm!:FormGroup;
  public signUpForm!:FormGroup;
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
  }

  private _loginFormInit(){
    this.loginForm = this.formBuilder.group({
      email:[null,[Validators.required, Validators.email,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,50}$/)]],
      password:[null,[Validators.required,Validators.minLength(8)]],
      phoneNumber:[null,[Validators.required]]
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

  //CLIENT TOKEN
  public getLoginClientToken() {
    this.clientToken = '';
    this.isLoading = true;

    this.auth.getLoginClientToken(this.isAgent ? this._agentClientData : this._clientTokenData).subscribe({
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

  public userLogin(){

  }

  public changeLoginType(){
    this.isAgent = !this.isAgent;
    this.getLoginClientToken();
  }
}
