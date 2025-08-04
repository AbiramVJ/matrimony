import { ToastrService } from 'ngx-toastr';
import { TokenResult } from '../../../../models/index.model';
import { AdminService } from './../../../../services/admin.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FORM_MODULES } from '../../../../common/common-imports';
import { LoginType } from '../../../../helpers/enum';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule,FORM_MODULES],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {

  public clientToken:string = '';
  public isLoading:boolean = false;
  public loginForm!:FormGroup;
  public isSubmitted:boolean = false;

  constructor(
    private _adminService:AdminService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private auth:AuthService,

  ){}

  ngOnInit(): void {
    this._getAdminClientToken();
    this._loginFormInit();
  }

  private _loginFormInit(){
    this.loginForm = this.formBuilder.group({
      email:[null,[Validators.required,]],
      password:[null,[Validators.required,Validators.minLength(8)]],
    })
  }

  private _getAdminClientToken(){
    this.clientToken = '';
    this.isLoading = true;
    this._adminService.GetAdminClientToken().subscribe({
      next:(response:TokenResult)=>{
        this.clientToken = response.token;
        localStorage.removeItem('clientId');
        localStorage.setItem('clientId',response.token);
      },
      complete:() =>{
        this.isLoading = false;
      },
      error:(error:any) =>{
        this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
      }
    });
  }

  public login(){
    this.isLoading = true;
    this.isSubmitted = true;
    if(this.loginForm.valid){
      const body = {
        loginType: LoginType.Email,
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      }
      this._adminService.login(body, this.clientToken).subscribe({
        next:(res:any) => {
          this.auth.setAuthToken(res.Result.token);
          this.auth.setUser();
          this.isLoading = false;
          window.location.href = "/";
        }
      })
    }

  }
}
