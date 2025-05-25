import { ROUTER_MODULES } from './../common-imports';
import { SocialLoginService } from './../../services/auth/social-login.service';
import { AuthService } from './../../services/auth/auth.service';
import { MemberService } from './../../services/member.service';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, output } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../common-imports';
import { CommonModule } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { UserProfile } from '../../models/index.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  imports: [FORM_MODULES,COMMON_DIRECTIVES,ROUTER_MODULES,CommonModule],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent {
  @Input() hideProps = false;
  public isDropOpen:boolean = false;
  public isShowBox:boolean = false;
  public isLoading:boolean = false;

  public canAddProfile:boolean = false;

  public isMessageOpen = false;
  public isProfileOpen = false;
  public isNotificationOpen = false;
  public selectedMember!:UserProfile;
  public memberProfiles:UserProfile[] = [];
  public loginUserDetails:any;

  constructor(private eRef: ElementRef,
    private _memberService:MemberService,
    private _toastr: ToastrService,
    public router:Router,
    private _authService:AuthService,
    private _socialLoginService:SocialLoginService
  ){

  }
 @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideMessage = this.eRef.nativeElement.querySelector('.message-box')?.contains(target);
    const clickedInsideNotification = this.eRef.nativeElement.querySelector('.notification-box')?.contains(target);
    const clickedMessageIcon = this.eRef.nativeElement.querySelector('.mes')?.contains(target);
    const clickedNotificationIcon = this.eRef.nativeElement.querySelector('.noti')?.contains(target);
    const clickedProfileIcon = this.eRef.nativeElement.querySelector('.profi')?.contains(target);
    const clickedInsideRelevant = clickedInsideMessage || clickedInsideNotification || clickedMessageIcon || clickedNotificationIcon || clickedProfileIcon;

    if (!clickedInsideRelevant) {
      this.isNotificationOpen = false;
      this.isMessageOpen = false;
      this.isProfileOpen = false;
    }
  }

  ngOnInit(): void {
    this._getMemberProfiles();
    this._getLoginUserDetails();
    this._getCurrentMember();
  }

  toggleDropdown(type: 'message' | 'notification' | 'profile'): void {
  const wasMessageOpen = this.isMessageOpen;
  const wasNotificationOpen = this.isNotificationOpen;
  const wasProfileOpen = this.isProfileOpen;

  this.isMessageOpen = false;
  this.isNotificationOpen = false;
  this.isProfileOpen = false;

  if (type === 'message') {
    this.isMessageOpen = !wasMessageOpen;
  } else if (type === 'notification') {
    this.isNotificationOpen = !wasNotificationOpen;
  } else if (type === 'profile') {
    this.isProfileOpen = !wasProfileOpen;
  }
}

get displayedProfiles() {
  return this.canAddProfile ? this.memberProfiles : this.memberProfiles.slice(0, 3);
}


  private _getMemberProfiles(){

     this._authService.memberList$.subscribe(data => {
      if(data){
        this.memberProfiles = data;
      }
    })
  }

  private _getCurrentMember(){
  this._authService.member$.subscribe(data => {
    console.log(data);

      if(data){
        this.selectedMember = data;
      }
    })
  }

  public changeMember(){
    this._authService.setUserDetails(this.selectedMember);
    this.router.navigateByUrl('home/member/'+ this.selectedMember);
  }

  public viewMemberProfile(id:string){
    this.router.navigateByUrl('home/member/'+ this.selectedMember);
  }

  public _getLoginUserDetails(){
   this.loginUserDetails = this._authService.getTokenDecodeData();
  }

   _authLogout() {
    this._authService.removeAuthToken();
    this._socialLoginService.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('clientId');
     localStorage.removeItem('currentMemberId');
    this._authService.setUserDetails(null);
    window.location.href = "/";

  }

  navigateToRegister(){
    this.isProfileOpen = false;
    this.canAddProfile = false;
    this.router.navigateByUrl('member/member-registration');
  }

  public changeMemberProfile(id:string){
    localStorage.removeItem('currentMemberId');
    localStorage.setItem('currentMemberId',id);
    window.location.href = "/";
  }

}
