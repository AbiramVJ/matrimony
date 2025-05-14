import { Component } from '@angular/core';

@Component({
  selector: 'app-member-details',
  imports: [],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.scss',
  standalone:true
})
export class MemberDetailsComponent {
constructor(){
  console.log("hi")
}
}
