import { Component } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../common/common-imports';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../../../../models/index.model';

@Component({
  selector: 'app-filter-member-list',
  imports: [FORM_MODULES,COMMON_DIRECTIVES, CommonModule],
  templateUrl: './filter-member-list.component.html',
  styleUrl: './filter-member-list.component.scss'
})
export class FilterMemberListComponent {
  public memberProfiles:UserProfile[] = [];
}
