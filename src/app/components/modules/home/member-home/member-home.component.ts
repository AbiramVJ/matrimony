import { AuthService } from './../../../../services/auth/auth.service';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from "../../../../common/navigation-bar/navigation-bar.component";

@Component({
  selector: 'app-member-home',
  imports: [],
  templateUrl: './member-home.component.html',
  styleUrl: './member-home.component.scss'
})
export class MemberHomeComponent {

  constructor(private _authService:AuthService,private route: ActivatedRoute,){



}
}
