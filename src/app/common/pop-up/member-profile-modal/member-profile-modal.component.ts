import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { COMMON_DIRECTIVES } from '../../common-imports';
import { FullUserProfile } from '../../../models/index.model';

@Component({
  selector: 'app-member-profile-modal',
  imports: [CommonModule,COMMON_DIRECTIVES],
  templateUrl: './member-profile-modal.component.html',
  styleUrl: './member-profile-modal.component.scss'
})
export class MemberProfileModalComponent {
@Input() memberProfile!:FullUserProfile;

public tabs:any = [
  { id: 1, icon: 'fas fa-user', label: 'Overview' },
  { id: 2, icon: 'fas fa-heart', label: 'Personal' },
  { id: 3, icon: 'fas fa-briefcase', label: 'Career' },
  { id: 4, icon: 'fas fa-users', label: 'Family' },
  { id: 5, icon: 'fas fa-star', label: 'Astrology' }
];

public currentTap : number = 1;

ngOnChanges(): void {
  if(!this.memberProfile?.profileJob){
     this.tabs = this.tabs.filter((tab:any) => tab.id !== 3);
  }

  if(!this.memberProfile?.profileAstrology?.timeOfBirth && !this.memberProfile.profileAstrology?.starName && !this.memberProfile.profileAstrology?.rasiName){
    this.tabs = this.tabs.filter((tab:any) => tab.id !== 5);
  }

}

}
