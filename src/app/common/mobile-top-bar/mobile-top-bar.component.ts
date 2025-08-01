import { Component, HostListener } from '@angular/core';
import { UserProfile } from '../../models/index.model';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FORM_MODULES } from '../common-imports';

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
  constructor(private _authService:AuthService){

  }

  @HostListener('document:click')
  closeAllDropdowns(): void {
    this.showFriendDropdown = false;
    this.showNotificationDropdown = false;
  }

  ngOnInit(): void {
    this._getCurrentMember();
    this._getMemberProfiles();
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
    console.log(this.selectedMember)
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

}
