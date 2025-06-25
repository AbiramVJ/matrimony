import { ROUTER_MODULES } from './../common-imports';
import { SocialLoginService } from './../../services/auth/social-login.service';
import { AuthService } from './../../services/auth/auth.service';
import { MemberService } from './../../services/member.service';
import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../common-imports';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ChatParticipant, MainUser, UserProfile } from '../../models/index.model';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';

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
  public isNotificationOpen:boolean = false;

  public selectedMember!:UserProfile;
  public memberProfiles:UserProfile[] = [];

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


  constructor(private eRef: ElementRef,
    private _memberService:MemberService,
    private _toastr: ToastrService,
    public router:Router,
    private _authService:AuthService,
    private _socialLoginService:SocialLoginService,
    private _chatService:ChatService
  ){}

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
    this.getMainUser();

    this._chatService.onChatParticipantsReceived((data: any[]) => {
      this.participants = data;
      this.UnreadCount = this.participants.filter((p: ChatParticipant) => !p.isRead).length;
      console.log(this.participants);
    });
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

  get filteredChats(): any[] {
    if (!this.searchTerm) {
      return this.chatList;
    }

    return this.chatList.filter(chat =>
      chat.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getInitials(name: string): string {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  }

  selectChat(chatId: string): void {
    this.selectedChatId = chatId;
  }

  isTyping(message: string): boolean {
    return message === 'Typing...';
  }

  // CHAT


}
