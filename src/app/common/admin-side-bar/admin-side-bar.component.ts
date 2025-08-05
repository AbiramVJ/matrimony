import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ROUTER_MODULES } from '../common-imports';

@Component({
  selector: 'app-admin-side-bar',
  imports: [CommonModule,ROUTER_MODULES],
  templateUrl: './admin-side-bar.component.html',
  styleUrl: './admin-side-bar.component.scss'
})
export class AdminSideBarComponent {

}
