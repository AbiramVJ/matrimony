import { MemberApproval, SubscriptionStatus } from './helpers/enum';
import { FullUserProfile, MainUser, UserProfile } from './models/member/member.model';
import { FriendSignalRService } from './services/friend-signal-r.service';
import { ChatService } from './services/chat.service';
import { SignalRService } from './services/signal-r.service';
import { AuthService } from './services/auth/auth.service';
import { DataProviderService } from './services/data-provider.service';
import { Component, effect, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from "./common/navigation-bar/navigation-bar.component";
import { CommonModule } from '@angular/common';
import { COMMON_DIRECTIVES } from './common/common-imports';
import { MemberService } from './services/member.service';
import { MobileTopBarComponent } from "./common/mobile-top-bar/mobile-top-bar.component";
import { MemberProfileModalComponent } from "./common/pop-up/member-profile-modal/member-profile-modal.component";
import { UserType } from './helpers/util';
import { TopBarComponent } from "./common/top-bar/top-bar.component";
import { AdminSideBarComponent } from "./common/admin-side-bar/admin-side-bar.component";
import { LoadingComponent } from "./common/loading/loading.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, COMMON_DIRECTIVES, NavigationBarComponent, MobileTopBarComponent, MemberProfileModalComponent, TopBarComponent, AdminSideBarComponent, LoadingComponent],
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
  public filterMemberViewData: any;
  public userType = UserType;
  public currentUserType:any;
  public mainUser!: MainUser;
  public memberList:UserProfile[] = [];
  public subscriptionStatus = SubscriptionStatus;
  public isActiveSubscription = false;
  public currentMember:any;

  constructor(
     private dataProviderService:DataProviderService,
     private _authService:AuthService,
     private router: Router,
     private _memberService:MemberService,
     private _chatService:ChatService,
     private _friendSignalRService:FriendSignalRService,
     private _signalRService : SignalRService
    ){
      this.currentUserType = localStorage.getItem('userType');

    }

  ngOnInit(): void {
    this.dataProviderService.getUserGeoLocation();
    this._authService.member$.subscribe((data)=>{
        this.currentMemberDetails = data;
      })
    this._authService.authStatus.subscribe(data => {
      this.isLogin = data;
    });

    if(this.isLogin){
      if(localStorage.getItem('userType') === UserType.ADMIN){
        this._getAdmin();
      }else{
        this.getMainUser();
       // this.router.navigateByUrl('member/member-registration');
      }

    }else{
      this.isLoading = false;
    }
  }

  private _getMemberList(){
    this.isLoading = true;
    this._memberService.getProfiles().subscribe({
      next:(res:any) => {
        this.memberList = res;
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
            this.currentMember = member;
            this._authService.setUserDetails(member);
          }else{
            const approvalMembers = res.filter((member: any) => member.memberApproval === MemberApproval.Approved);
            if(approvalMembers.length > 0){
              localStorage.setItem('currentMemberId',res[0].id);
              this._authService.setUserDetails(res[0]);
              this.currentMember = res[0];
            }else{
               localStorage.setItem('currentMemberId',res[0].id);
               this._authService.setUserDetails(res[0]);
               this.currentMember = res[0];
               this.router.navigateByUrl('member/approval');
               this.isLoading =  false;
               return;
            }

          }

          if(res.length === 1 && res[0].memberApproval === MemberApproval.Pending)
          {
            this.router.navigateByUrl('member/approval');
            this.isLoading =  false;
            return;
          }
          this._chatService.startConnection();
          this._friendSignalRService.startConnection();
          this._signalRService.startNotificationHub();
          this.isLoading = false;
          this._memberService.setInitialLoading(false);
        }
      },
      complete:() =>{
       // this._signalRService.startConnection();
      //  this.router.navigateByUrl('home/member');
      },
      error:(error:any)=>{
      this.isLoading = false;
      }
    })
  }

  private _getAdmin(){
    this.isLoading = false;
    this.router.navigateByUrl("admin/dashboard");
  }

  public openMemberViewPopUp(member:FullUserProfile){
    this.filterMemberViewData = member;
    let viewModal: HTMLElement = document.getElementById('viewProfileModals') as HTMLElement;
    if (viewModal) {
      viewModal.click();
    }
  }

   public viewMemberDetails(id: string) {
    this._memberService.GetFilterMemberViewData(id).subscribe({
      next: (res: any) => {
        this.filterMemberViewData = res;
      },
      complete: () => {},
      error: (error: any) => {},
    });
  }


   private getMainUser() {
    this._memberService.setInitialLoading(true);
    this.isLoading = true;
    this._memberService.getMainUser().subscribe({
      next: (res: any) => {
        this.mainUser = res;
        this._authService.setMainUser(res);
        this._authService.setActiveSubscription(res.isActiveSubscription);
        if(res.isActiveSubscription){
          this._getMemberList();
        } else{
          console.log('redirect to plan');
          this.isLoading = false;
          res.subscriptionStatus === this.subscriptionStatus.none ? this.router.navigateByUrl('member/plans') : this.router.navigateByUrl('member/billing');
        }
      },
      complete: () => {},
      error: (error: any) => {this.isLoading = false;},
    });
  }

}
