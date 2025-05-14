import { AuthService } from './services/auth/auth.service';
import { DataProviderService } from './services/data-provider.service';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from "./common/navigation-bar/navigation-bar.component";
import { CommonModule } from '@angular/common';
import { COMMON_DIRECTIVES } from './common/common-imports';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, COMMON_DIRECTIVES, NavigationBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'matrimony';
  public isLogin:boolean = false;
  public hideNavProps = false;
  public currentMemberDetails:any;

  constructor(private dataProviderService:DataProviderService, private _authService:AuthService,private router: Router){
    this._authService.authStatus.subscribe(data => {
      this.isLogin = data;
    });
  }

  ngOnInit(): void {
    this.dataProviderService.getUserGeoLocation();
    this._authService.member$.subscribe((data)=>{
      console.log(data);
        this.currentMemberDetails = data;
      })

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.hideNavProps = event.urlAfterRedirects.includes('/member/member-registration');
    });
  }


}
