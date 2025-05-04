import { Component } from '@angular/core';
import { TopBarComponent } from "../../../../../common/top-bar/top-bar.component";
import { MemberProfileFormComponent } from "./member-profile-form/member-profile-form.component";
import { FormBuilder } from '@angular/forms';
import { UserBasicForm } from '../../../../../models/index.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-member-form',
  imports: [TopBarComponent, MemberProfileFormComponent],
  templateUrl: './member-form.component.html',
  styleUrl: './member-form.component.scss'
})
export class MemberFormComponent {


  constructor(private formBuilder: FormBuilder, private route:Router){

  }

  public getUserBasicDetailsEmitter(event:UserBasicForm){
    console.log(event);
  }

  public goBack(){
    this.route.navigateByUrl('member/profiles');
  }
}
