import { AuthService } from './../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from './../../../services/member.service';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { COMMON_DIRECTIVES } from '../../common-imports';
import { ChatParticipant, FullUserProfile, MainUser, MemberProfile, Request } from '../../../models/index.model';
import { FriendRequestStatus } from '../../../helpers/enum';
import { ChatService } from '../../../services/chat.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-member-profile-modal',
  imports: [CommonModule,COMMON_DIRECTIVES, TitleCasePipe],
  templateUrl: './member-profile-modal.component.html',
  styleUrl: './member-profile-modal.component.scss'
})
export class MemberProfileModalComponent {
@Input() memberProfile!:FullUserProfile;
@Input() isPopUp:boolean = false;
@Input() isAdmin:boolean = false;

public mainUser!:MainUser;

public tabs:any = [
  { id: 1, icon: 'fas fa-user', label: 'Overview' },
  { id: 2, icon: 'fas fa-heart', label: 'Personal' },
  { id: 3, icon: 'fas fa-briefcase', label: 'Career' },
  { id: 4, icon: 'fas fa-users', label: 'Family' },
  { id: 5, icon: 'fas fa-star', label: 'Astrology' }
];

public currentTap : number = 1;
public request = FriendRequestStatus;
public isLoading:boolean = false;
public selectedMember:string = '';

constructor(
  private _memberService:MemberService,
  private _toster:ToastrService,
  private _authService:AuthService,
  private _chatService: ChatService,
  private router: Router,
){

}

ngOnInit(): void {
  this.getMainUser();
}

ngOnChanges(): void {
  if(this.memberProfile){
    if(!this.memberProfile?.profileJob){
        this.tabs = this.tabs.filter((tab:any) => tab.id !== 3);
      }

      if(!this.memberProfile?.profileAstrology?.timeOfBirth && !this.memberProfile.profileAstrology?.starName && !this.memberProfile.profileAstrology?.rasiName){
        this.tabs = this.tabs.filter((tab:any) => tab.id !== 5);
      }
  }
  this._getCurrentMember();
}


  private _getCurrentMember(){
  this._authService.member$.subscribe(data => {
      if(data){
        this.selectedMember = data.id;
      }
    })
  }

  public addFriendRequest(id:string){
    this.isLoading = true;
    this._memberService.addFriendRequest(id).subscribe({
      next:(res:any)=>{
        var fr = new Request({status:1,id:res.id})
        this.memberProfile.friendRequest = fr;
        this._toster.success('Friend request sent.','Success');
      },
      complete:()=>{
        this.isLoading = false;
      },
      error:(error:any)=>{
        this._toster.error(error.error.Error.Title,error.error.Error.Detail);
        this.isLoading = false;
      }
    })
  }

  public confirmFriendRequest(id:any){
    this.isLoading = true;
    this._memberService.acceptFriendRequest(id).subscribe({
      next:(res:any) => {
        var fr = new Request({status:this.request.Accepted})
        this.memberProfile.friendRequest = fr;
        this._toster.success(res,'Confirm');
      },
      complete:()=>{
        this.isLoading = false;
      },
      error:(error:any)=>{
       this._toster.error(error.error.Error.Title,error.error.Error.Detail);
       this.isLoading = false;
      }
    })
  }

  public cancelFriendRequest(id:any){
    this.isLoading = true;
    this._memberService.cancelRequest(id).subscribe({
      next:(res:any) => {
        this._toster.success(res,'cancel');
      },
      complete:()=>{
        this.memberProfile.friendRequest = null;
        this.isLoading = false;
      },
      error:(error:any)=>{
       this._toster.error(error.error.Error.Title,error.error.Error.Detail);
       this.isLoading = false;
      }
    })
  }

  public openChat(member: FullUserProfile) {
    this._chatService.clearParticipant();
    const openChatMember = new ChatParticipant({
      receiverProfileId: member.id,
      name: member.firstName,
      profileImage: member.profileImages[0].url,
      lastSentAt: new Date().toString(),
      isRead: false,
    });
    this._chatService.setParticipant(openChatMember);
    let viewModal: HTMLElement = document.getElementById(
              'member-profile-close-btn'
            ) as HTMLElement;
            if (viewModal) {
              viewModal.click();
            }
    this.router.navigate(['/home/chat']);
  }

  private getMainUser(){
    this._authService.mainUser$.subscribe((res:any)=>{
      this.mainUser = res;
    })
  }

}
