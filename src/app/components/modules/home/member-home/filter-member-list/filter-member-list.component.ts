import { ChatService } from './../../../../../services/chat.service';
import { Router } from '@angular/router';
import { MemberService } from './../../../../../services/member.service';
import { AuthService } from './../../../../../services/auth/auth.service';
import { Component } from '@angular/core';
import {
  COMMON_DIRECTIVES,
  FORM_MODULES,
} from '../../../../../common/common-imports';
import { CommonModule } from '@angular/common';
import {
  ChatParticipant,
  FullUserProfile,
  MemberProfile,
  UserProfile,
} from '../../../../../models/index.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { MemberProfileModalComponent } from '../../../../../common/pop-up/member-profile-modal/member-profile-modal.component';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-filter-member-list',
  imports: [
    FORM_MODULES,
    COMMON_DIRECTIVES,
    CommonModule,
    NgxPaginationModule,
    MemberProfileModalComponent,
  ],
  templateUrl: './filter-member-list.component.html',
  styleUrl: './filter-member-list.component.scss',
})
export class FilterMemberListComponent {
  public memberProfiles: MemberProfile[] = [];
  public filterMemberViewData!: FullUserProfile;
  public currentsUser!: UserProfile;
  public totalItemCount: number = 0;
  public itemsPerPage: number = 6;
  public currentPage: number = 1;
  public isLoading: boolean = false;
  public filter: any;
  private destroy$ = new Subject<void>();

  constructor(
    private auth: AuthService,
    private memberService: MemberService,
    private _toastr: ToastrService,
    private router: Router,
    private _chatService: ChatService
  ) {
    this.auth.member$.subscribe((data) => {
      if (data) {
        this.currentsUser = data;
      }
    });

    this.memberService.filter$
      .pipe(takeUntil(this.destroy$))
      .subscribe((filter) => {
        if (filter) {
          console.log(filter);
          this.filter = filter;
          this.getAllMatchingProfiles();
        }
      });
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
    this.memberService
      .getMatchingData(this.filter, userId, this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (res: any) => {
          this.memberProfiles = res.data;
          this.totalItemCount = res.totalCount;
          this.isLoading = false;
        },
        complete: () => {
          //this.memberService.m
        },
        error: (error: any) => {
          this.isLoading = false;
          this._toastr.error(error.error.Error.Detail, error.error.Error.Title);
        },
      });
  }

  public viewMemberDetails(id: string) {
    // this.isLoading = true;
    this.memberService.GetFilterMemberViewData(id).subscribe({
      next: (res: any) => {
        this.filterMemberViewData = res;
        console.log(res);
        // this.isLoading = false;
      },
      complete: () => {
        let viewModal: HTMLElement = document.getElementById(
          'viewProfileModal'
        ) as HTMLElement;
        if (viewModal) {
          viewModal.click();
        }
      },
      error: (error: any) => {
        //   this.isLoading = false;
        this._toastr.error(error.error.Error.Detail, error.error.Error.Title);
      },
    });
  }

  public addMember() {
    this.router.navigateByUrl('member/member-registration');
  }

  public openChat(member: MemberProfile) {
    const openChatMember = new ChatParticipant({
      receiverProfileId: member.id,
      name: member.firstName,
      profileImage: member.imageUrl,
      lastSentAt: new Date().toString(),
      isRead: false,
    });

    this._chatService.setParticipant(openChatMember);

    this.router.navigate(['/home/chat']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.memberService.setFilter(null);
  }
}
