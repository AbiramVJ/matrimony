import { AuthService } from './../../../../services/auth/auth.service';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from "../../../../common/navigation-bar/navigation-bar.component";
import { SideBarComponent } from "../../../../common/side-bar/side-bar.component";
import { FilterMemberListComponent } from "./filter-member-list/filter-member-list.component";
import { MobileTopBarComponent } from "../../../../common/mobile-top-bar/mobile-top-bar.component";

@Component({
  selector: 'app-member-home',
  imports: [SideBarComponent, FilterMemberListComponent, MobileTopBarComponent],
  templateUrl: './member-home.component.html',
  styleUrl: './member-home.component.scss'
})
export class MemberHomeComponent {

  constructor(private _authService:AuthService,private route: ActivatedRoute,){

  }

}
