import { Component } from '@angular/core';
import { UserProfile } from '../../models/index.model';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mobile-top-bar',
  imports: [CommonModule],
  templateUrl: './mobile-top-bar.component.html',
  styleUrl: './mobile-top-bar.component.scss'
})
export class MobileTopBarComponent {
  public selectedMember!:UserProfile;

  constructor(private _authService:AuthService){

  }

  ngOnInit(): void {
    this._getCurrentMember();
  }


  private _getCurrentMember(){
  this._authService.member$.subscribe(data => {
      if(data){
        this.selectedMember = data;
      }
    })
  }

}
