import { AuthService } from './services/auth/auth.service';
import { DataProviderService } from './services/data-provider.service';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from "./common/navigation-bar/navigation-bar.component";
import { CommonModule } from '@angular/common';
import { COMMON_DIRECTIVES } from './common/common-imports';
import { MemberService } from './services/member.service';
import { MobileTopBarComponent } from "./common/mobile-top-bar/mobile-top-bar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, COMMON_DIRECTIVES, NavigationBarComponent, MobileTopBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'matrimony';
  public isLogin:boolean = false;
  public isLoading:boolean = true;
  public hideNavProps = false;
  public isCanRenderSideBar:boolean = false;
  public currentMemberDetails:any;

  constructor(
     private dataProviderService:DataProviderService,
     private _authService:AuthService,
     private router: Router,
     private _memberService:MemberService
    ){

  }

  ngOnInit(): void {
    this.dataProviderService.getUserGeoLocation();
    this._authService.member$.subscribe((data)=>{
        this.currentMemberDetails = data;
      })

    // this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
    //   this.hideNavProps = event.urlAfterRedirects.includes('/member/member-registration');
    // });


    this._authService.authStatus.subscribe(data => {
      this.isLogin = data;
    });

    this._getMemberList();
  }

  private _getMemberList(){
    this.isLoading = true;
    this._memberService.getProfiles().subscribe({
      next:(res:any) => {
        if(res.length === 0){
          this.hideNavProps = true;
          this._authService.setMemberList(null);
          this._authService.setUserDetails(null);
          localStorage.removeItem('currentMemberId');
          this.isLoading =  false;
          this.router.navigateByUrl('member/member-registration');
          return;
        }else{
          this._authService.setMemberList(res);
          this.hideNavProps = false;
          const currentMemberId = localStorage.getItem('currentMemberId');
          if(currentMemberId){
            const member = res.find((member:any) => member.id === currentMemberId);
            this._authService.setUserDetails(member);
          }else{
            localStorage.setItem('currentMemberId',res[0].id);
            this._authService.setUserDetails(res[0]);
          }
          this.isLoading = false;
        }
      },
      complete:() =>{

      },
      error:(error:any)=>{
      this.isLoading = false;
      }
    })
  }

}
