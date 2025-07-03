import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-friends',
  imports: [CommonModule],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss'
})
export class FriendsComponent {
selectedTab: string = 'friends';

selectTab(tab: string) {
  this.selectedTab = tab;
}

}
