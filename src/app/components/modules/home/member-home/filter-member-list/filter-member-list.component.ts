import { MemberService } from './../../../../../services/member.service';
import { AuthService } from './../../../../../services/auth/auth.service';
import { Component } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../common/common-imports';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../../../../models/index.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-filter-member-list',
  imports: [FORM_MODULES,COMMON_DIRECTIVES, CommonModule,NgxPaginationModule],
  templateUrl: './filter-member-list.component.html',
  styleUrl: './filter-member-list.component.scss'
})
export class FilterMemberListComponent {
  public memberProfiles:UserProfile[] = [];
  public currentsUser!:UserProfile;
  public totalItemCount: number = 0;
  public itemsPerPage: number = 10;
  public currentPage: number = 1;
  public isLoading:boolean = false;
  public filter:any;

  constructor(private auth:AuthService, private memberService:MemberService,  private _toastr: ToastrService,){
     this.auth.member$.subscribe(data => {
      if(data){
       this.currentsUser = data;
      }
    });
    this.memberService.filter$.subscribe(filter => {
    if (filter) {
      this.filter =  filter;
      this.getAllMatchingProfiles();
    }
  });
  // this.auth.memberList$.subscribe(data => {
  //     if(data){
  //       this.memberProfiles = data;
  //     }
  //   })
  }
    public changePerPageValue(pageNumber: number) {
    if (pageNumber != 0 && pageNumber != null) {
      this.currentPage = 1;
      this.itemsPerPage = pageNumber;
      this.getAllMatchingProfiles();
    }
  }

  public pageChanged(event: any) {
    this.currentPage = event;
    this.getAllMatchingProfiles();
  }

  public getAllMatchingProfiles() {
  this.isLoading = true;
  const userId = this.currentsUser.id;
  this.memberService.getMatchingData(this.filter, userId, this.currentPage, this.itemsPerPage).subscribe({
    next:(res:any) => {
    this.memberProfiles = res.data;
    this.totalItemCount = res.totalCount;
    this.isLoading = false;
    },
    complete:() => {

    },
    error:(error:any) => {
      this.isLoading = false;
      this._toastr.error(error.error.Error.Detail,error.error.Error.Title);
    }

  });
  }
}
