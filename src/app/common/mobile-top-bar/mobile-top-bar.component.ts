import { Component, HostListener } from '@angular/core';
import { RequestList, UserProfile } from '../../models/index.model';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FORM_MODULES } from '../common-imports';
import { MemberService } from '../../services/member.service';
import { FriendRequestStatus } from '../../helpers/enum';

@Component({
  selector: 'app-mobile-top-bar',
  imports: [CommonModule, FORM_MODULES],
  templateUrl: './mobile-top-bar.component.html',
  styleUrl: './mobile-top-bar.component.scss'
})

export class MobileTopBarComponent {
  public selectedMember!:UserProfile;
  public memberProfiles: UserProfile[] = [];
  public showFriendDropdown = false;
  public showNotificationDropdown = false;
  public isRequestLoading: boolean = false;
  public isNotificationLoading: boolean = false;
  public isUnread: boolean = false;
  public totalRequestList: number = 0;

  public friendRequestList: RequestList[] = [];
  public currentPage = 1;
  public pageSize = 5;
  public hasMoreRequests = true;
  public request = FriendRequestStatus;
  constructor(private _authService:AuthService,private _memberService: MemberService,){

  }

  @HostListener('document:click')
  closeAllDropdowns(): void {
    this.showFriendDropdown = false;
    this.showNotificationDropdown = false;
  }

  ngOnInit(): void {
    this._getCurrentMember();
    this._getMemberProfiles();
    this._getRequests();
  }


  private _getCurrentMember(){
  this._authService.member$.subscribe(data => {
      if(data){
        this.selectedMember = data;
      }
    })
  }


  private _getMemberProfiles() {
    this._authService.memberList$.subscribe((data) => {
      if (data) {
        this.memberProfiles = data;
      }
    });
  }

   public changeMemberProfile() {
    localStorage.removeItem('currentMemberId');
    localStorage.setItem('currentMemberId', this.selectedMember.id);
    window.location.href = '/';
  }

  toggleDropdown(type: 'friend' | 'notification', event: MouseEvent): void {
    event.stopPropagation();
    event.stopPropagation()
    if (type === 'friend') {
      this.showFriendDropdown = !this.showFriendDropdown;
      this.showNotificationDropdown = false;
    } else {
      this.showNotificationDropdown = !this.showNotificationDropdown;
      this.showFriendDropdown = false;
    }
  }

    //FRIENDS REQUEST
  private _getRequests() {
    if (this.isRequestLoading || !this.hasMoreRequests) return;

    this.isRequestLoading = true;

    this._memberService
      .GetFriendRequests(this.currentPage, this.pageSize)
      .subscribe({
        next: (res: any) => {
          if (res.data.length < this.pageSize) {
            this.hasMoreRequests = false;
          }
          this.totalRequestList = res.totalCount;
          this.friendRequestList.push(...res.data);
          this.currentPage++;
        },
        complete: () => {
          this.isRequestLoading = false;
        },
      });
  }

}
