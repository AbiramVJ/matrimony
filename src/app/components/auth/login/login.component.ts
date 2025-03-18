import { routes } from './../../../app.routes';
import { Component, OnInit } from '@angular/core';
import { FORM_MODULES, ROUTER_MODULES } from '../../../common/common-imports';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { matrimonyConfig } from '../../../helpers/util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  imports: [FORM_MODULES, CommonModule, ROUTER_MODULES, FORM_MODULES],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private _clientTokenData = matrimonyConfig.clientData;
  public clientToken: string = '';

  public isLoading:boolean = false;
  public isSubmitted:boolean = false;

  public loginForm!:FormGroup;

  constructor(
    private auth:AuthService,
    private router:Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,

  ){}
  ngOnInit(): void {
    this._loginFormInit();
    this._getLoginClientToken();
  }

  private _loginFormInit(){
    this.loginForm = this.formBuilder.group({
      email:[null,[Validators.required, Validators.email,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,50}$/)]],
      password:[null,[Validators.required,Validators.minLength(8)]],
      phoneNumber:[null,[Validators.required]]
    })
  }

  //CLIENT TOKEN
  private _getLoginClientToken() {
    this.clientToken = '';
    this.isLoading = true;
    this.auth.getLoginClientToken(this._clientTokenData).subscribe({
      next:(response:any)=>{
        console.log(response);
        this.clientToken = response['result']['token'];
      },
      complete:() =>{
        this.isLoading = false;
      },
      error:(error:any) =>{
        this.toastr.error(error.detail, error.title);
      }
    });
  }

  public userLogin(){

  }
}
