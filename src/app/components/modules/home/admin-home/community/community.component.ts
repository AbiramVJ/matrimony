import { Component } from '@angular/core';
import { MemberService } from '../../../../../services/member.service';
import { Community } from '../../../../../models/index.model';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../common/common-imports';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonResponse } from '../../../../../models/commonResponse.model';

@Component({
  selector: 'app-community',
  imports: [COMMON_DIRECTIVES,NgxPaginationModule,FORM_MODULES],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss'
})
export class CommunityComponent {

  public isLoading = false;
  public communityList:Community[] = [];
  public totalItemCount: number = 0;
  public itemsPerPage: number = 6;
  public currentPage: number = 1;
  constructor(private memberService:MemberService){

  }

  ngOnInit(): void {
    this._getCommunity();
  }

  private _getCommunity(){
    this.isLoading = true;
    this.memberService.getCommunityWithPagination(this.currentPage, this.itemsPerPage).subscribe({
      next:(res:any) => {
        console.log(res);
        this.communityList = res.data;
        this.totalItemCount = res.totalCount;
      },
      complete:() => {
        this.isLoading = false;
      },
      error:(error:Error) => {
        this.isLoading = false;
      }
    })
  }

  public changePerPageValue(pageNumber: number) {
    if (pageNumber != 0 && pageNumber != null) {
      this.currentPage = 1;
      this.itemsPerPage = pageNumber;
      this._getCommunity();
    }
  }

  public pageChanged(event: any) {
    this.currentPage = event;
    this._getCommunity();
  }
}
