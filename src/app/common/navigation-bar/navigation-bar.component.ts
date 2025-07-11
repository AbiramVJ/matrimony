import { SignalRService } from './../../services/signal-r.service';
import { FriendSignalRService } from './../../services/friend-signal-r.service';
import { ROUTER_MODULES } from './../common-imports';
import { SocialLoginService } from './../../services/auth/social-login.service';
import { AuthService } from './../../services/auth/auth.service';
import { MemberService } from './../../services/member.service';
import { Component, ElementRef, HostListener, Input, SimpleChanges } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../common-imports';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ChatParticipant, MainUser, MemberProfile, RequestList, UserProfile } from '../../models/index.model';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { FriendRequestStatus } from '../../helpers/enum';
import { CommonResponse } from '../../models/commonResponse.model';
import { SignalNode } from '@angular/core/primitives/signals';

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
  public isMessageOpen:boolean = false;
  public isProfileOpen:boolean = false;
  public isRequestLoading:boolean = false;

  public currentPage = 1;
  public pageSize = 5;
  public hasMoreRequests = true;

  public isNotificationOpen:boolean = false;
  public isFriendRequestOpen = false;  // new state
  public selectedMember!:UserProfile;
  public memberProfiles:UserProfile[] = [];
  public request = FriendRequestStatus;
  public loginUserDetails:any;
  public mainUser!:MainUser;

  public searchTerm: string = '';
  public selectedChatId: any = null;

  public UnreadCount:number = 0;

  public chatList: any[] = [
  {
    id: 1,
    name: 'Abiram',
    imageUrl: '',
    lastMessage: 'hello, good morning',
    isOnline: true,
    unReadCount: 5
  },
  {
    id: 2,
    name: 'Sneha',
    imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    lastMessage: 'Are we still on for tonight?',
    isOnline: false,
    unReadCount: 0
  },
  {
    id: 3,
    name: 'Ravi Kumar',
    imageUrl: 'https://randomuser.me/api/portraits/men/33.jpg',
    lastMessage: 'Sent you the files.',
    isOnline: true,
    unReadCount: 2
  },
  {
    id: 4,
    name: 'Meera',
    imageUrl: '',
    lastMessage: 'Typing...',
    isOnline: true,
    unReadCount: 0
  },
  {
    id: 5,
    name: 'John Doe',
    imageUrl: 'https://randomuser.me/api/portraits/men/74.jpg',
    lastMessage: '👍',
    isOnline: false,
    unReadCount: 7
  },
  {
    id: 6,
    name: 'Priya Sharma',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: 'Let me know once you’re free.',
    isOnline: true,
    unReadCount: 0
  },
  {
    id: 7,
    name: 'Nikhil Raj',
    imageUrl: '',
    lastMessage: 'Thanks!',
    isOnline: false,
    unReadCount: 1
  }
];

  public participants: ChatParticipant[] = [];
  public friendRequestList:RequestList[] = [];
  public totalRequestList:number = 0;


  constructor(private eRef: ElementRef,
    private _memberService:MemberService,
    private _toastr: ToastrService,
    public router:Router,
    private _authService:AuthService,
    private _socialLoginService:SocialLoginService,
    private _chatService:ChatService,
    private _friendSignalRService : FriendSignalRService,
    private _toster:ToastrService,
    private _signalRService:SignalRService
  ){}

@HostListener('document:click', ['$event'])
handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const clickedInsideMessage = this.eRef.nativeElement.querySelector('.message-box')?.contains(target);
  const clickedInsideNotification = this.eRef.nativeElement.querySelector('.notification-box')?.contains(target);
  const clickedInsideFriendRequest = this.eRef.nativeElement.querySelector('.friend-request-box')?.contains(target); // new
  const clickedMessageIcon = this.eRef.nativeElement.querySelector('.mes')?.contains(target);
  const clickedNotificationIcon = this.eRef.nativeElement.querySelector('.noti')?.contains(target);
  const clickedProfileIcon = this.eRef.nativeElement.querySelector('.profi')?.contains(target);
  const clickedFriendRequestIcon = this.eRef.nativeElement.querySelector('.friend')?.contains(target); // new

  const clickedInsideRelevant = clickedInsideMessage || clickedInsideNotification || clickedInsideFriendRequest ||
                                clickedMessageIcon || clickedNotificationIcon || clickedProfileIcon || clickedFriendRequestIcon;

  if (!clickedInsideRelevant) {
    this.isNotificationOpen = false;
    this.isMessageOpen = false;
    this.isProfileOpen = false;
    this.isFriendRequestOpen = false; // close friend request dropdown too
  }
}


  ngOnInit(): void {
    this._getMemberProfiles();
    this._getLoginUserDetails();
    this._getCurrentMember();
    this.getMainUser();
    this._getRequests();

    this._chatService.onChatParticipantsReceived((data: any[]) => {
      this.participants = data;
      this.UnreadCount = this.participants.filter((p: ChatParticipant) => !p.isRead).length;
    });

    this._friendSignalRService.registerFriendRequestListener((message: any) => {
      const newRequest = new RequestList(message);
      const existingIndex = this.friendRequestList.findIndex((r: any) => r.senderProfileId === newRequest.senderProfileId);
      if (existingIndex !== -1) {
        this.friendRequestList.splice(existingIndex, 1);
      }
      this.friendRequestList.unshift(message);
      if (Notification.permission === 'granted') {
      new Notification('New Friend Request', {
        body: `You received a request from ${message.name}`,
        icon: 'assets/icons/friend-request.png'
      });
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
      audio.play();

      }
    });

    this._signalRService.receiveNotification((notification:any) => {
        console.log(notification);
    })
  }

 public toggleDropdown(type: 'message' | 'notification' | 'profile' | 'friendRequest'): void {
  const wasMessageOpen = this.isMessageOpen;
  const wasNotificationOpen = this.isNotificationOpen;
  const wasProfileOpen = this.isProfileOpen;
  const wasFriendRequestOpen = this.isFriendRequestOpen;  // new variable

  this.isMessageOpen = false;
  this.isNotificationOpen = false;
  this.isProfileOpen = false;
  this.isFriendRequestOpen = false;  // close all dropdowns

  if (type === 'message') {
    this.isMessageOpen = !wasMessageOpen;
  } else if (type === 'notification') {
    this.isNotificationOpen = !wasNotificationOpen;
  } else if (type === 'profile') {
    this.isProfileOpen = !wasProfileOpen;
  } else if (type === 'friendRequest') {  // new condition
    this.isFriendRequestOpen = !wasFriendRequestOpen;
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
      if(data){
        this.selectedMember = data;
      }
    })
  }

  private getMainUser(){
    this._memberService.getMainUser().subscribe({
      next:(res:any)=>{
        this.mainUser = res;
      },
      complete:()=>{},
      error:(error:any)=>{}
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

  getInitials(name: string): string {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  }

  public openChat(member: ChatParticipant) {
    this.selectedChatId = member.receiverProfileId;
      this._chatService.clearParticipant();
      const openChatMember = new ChatParticipant({
        receiverProfileId: member.receiverProfileId,
        name: member.name,
        profileImage: member.profileImage,
        lastSentAt: new Date().toString(),
        isRead: member.isRead,
      });

      this._chatService.setParticipant(openChatMember);

      this.router.navigate(['/home/chat']);
    }

  isTyping(message: string): boolean {
    return message === 'Typing...';
  }


  //FRIENDS REQUEST
  private _getRequests() {
    if (this.isRequestLoading || !this.hasMoreRequests) return;

    this.isRequestLoading = true;

    this._memberService.GetFriendRequests(this.currentPage, this.pageSize).subscribe({
      next:(res: any) => {
        if (res.data.length < this.pageSize) {
          this.hasMoreRequests = false;

        }
        this.totalRequestList = res.totalCount;
        this.friendRequestList.push(...res.data);
        this.currentPage++;
      },
      complete: () => {
        this.isRequestLoading = false;
      }
    });
  }

    onScroll(event: any) {
      const element = event.target;
      const scrollBottom = Math.ceil(element.scrollTop + element.clientHeight);

      if (scrollBottom >= element.scrollHeight) {
        this._getRequests();
      }
    }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['isFriendRequestOpen']?.currentValue) {
      this.resetAndLoadRequests();
    }
  }

  resetAndLoadRequests() {
    this.currentPage = 1;
    this.hasMoreRequests = true;
    this.friendRequestList = [];
    this._getRequests();
  }



  public confirmFriendRequest(id:any){
    this.isRequestLoading = true;
    this._memberService.acceptFriendRequest(id).subscribe({
      next:(res:any) => {
        const request = this.friendRequestList.find((r: any) => r.id === id);
        if (request) {
          request.status = this.request.Accepted;
        }
        this._toster.success(res,'Confirm');
      },
      complete:()=>{
        this.isRequestLoading = false;
      },
      error:(error:any)=>{
        this._toster.error(error.error.Error.Title,error.error.Error.Detail);
        this.isRequestLoading = false;
      }
    })
  }

  public rejectFriendRequest(id:any){
    this.isRequestLoading = true;
    this._memberService.rejectFriendRequest(id).subscribe({
      next:(res:any) => {
        const request = this.friendRequestList.find((r: any) => r.id === id);
        if (request) {
          request.status = this.request.Rejected;
        }
        this._toster.success(res,'rejected');
      },
      complete:()=>{
        this.isRequestLoading = false;
      },
      error:(error:any)=>{
        this._toster.error(error.error.Error.Title,error.error.Error.Detail);
        this.isRequestLoading = false;
      }
    })
  }

}
