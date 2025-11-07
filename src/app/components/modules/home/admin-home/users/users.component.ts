import { MemberService } from './../../../../../services/member.service';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../../services/admin.service';
import { sortedBy, sortedDirection, subscriptionTypeList } from './../../../../../helpers/data';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectComponent } from "@ng-select/ng-select";
import { User } from '../../../../../models/member/user.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { LoadingComponent } from "../../../../../common/loading/loading.component";
import { FullUserProfile } from '../../../../../models/index.model';
import { MemberProfileModalComponent } from "../../../../../common/pop-up/member-profile-modal/member-profile-modal.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, NgSelectComponent, NgxPaginationModule, LoadingComponent, MemberProfileModalComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  public totalItemCount:number = 0;
  public userList:User[] = [];

  public searchText:string = '';
  public deleteUserId:string = '';
  public viewMemberId:string = '';

  public itemsPerPage: number = 6;
  public currentPage: number = 1;
  public isLoading:boolean = false;
  public isMemberViewLoading:boolean = false;
  public isApprovalLoading:boolean = false;

  public selectedStatus:number = 0;
  public selectedSortBy:number = 0;
  public selectedDirection:number = 0;

  public subscriptionTypes = subscriptionTypeList;
  public sortedBy = sortedBy;
  public sortedDirection = sortedDirection;
  public openedUserId: number | null = null;
  public filterMemberViewData!: FullUserProfile;

  public searchValue = new BehaviorSubject<any>(null);

  constructor(private _adminService:AdminService, private memberService:MemberService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadUsers();
    this.searchValue.pipe(debounceTime(1000)).subscribe(searchText => {
        if (searchText != null) {
          this.getSearchActivities(searchText);
        }
      });
  }

  private loadUsers(){
    this.isLoading = true;
    let body = {
      searchText: this.searchText,
      subscriptionType: this.selectedStatus == 0 ? null : this.selectedStatus,
      sortField: this.selectedSortBy == 0 ? null : this.selectedSortBy,
      sortDirection: this.selectedDirection == 0 ? null : this.selectedDirection
    }
    this._adminService.getAllUsers(this.currentPage, this.itemsPerPage, body).subscribe({
      next:(res:any) => {
        console.log(res);
        this.userList = res.data;
        this.totalItemCount = res.totalCount;
        this.isLoading = false;
      },
      error:(error:Error) => {
        console.error('Error loading users:', error);
        this.userList = [];
        this.totalItemCount = 0;
        this.isLoading = false;
      }
    });
  }

  public changePerPageValue(pageNumber: number) {
    if (pageNumber != 0 && pageNumber != null) {
      this.currentPage = 1;
      this.itemsPerPage = pageNumber;
      this.loadUsers();
    }
  }

  public pageChanged(event: any) {
    this.currentPage = event;
    this.loadUsers();
  }

  public getSearchActivities(searchText:string){
    this.searchText = searchText;
    this.loadUsers();
  }

  public searchUser(searchText:string){
    this.searchValue.next(searchText);
  }

  public changFilter(){
    this.currentPage = 1;
    this.loadUsers();
  }

  public deleteUser(){
    this.isLoading = true;
    this._adminService.deleteUser(this.deleteUserId).subscribe({
      next:(res:any)=>{
        this.loadUsers();
      },
      complete:()=>{
        this.isLoading = false;
        this.deleteUserId = '';
        let closeModal: HTMLElement = document.getElementById('close-delete-user-modal-btn') as HTMLElement;
        closeModal.click();
      },
      error:(error:Error)=>{
        console.error('Error deleting user:', error);
        this.isLoading = false;
      }
    });
  }

  public viewMember(id:string){
    this.isMemberViewLoading = true;
    this.viewMemberId = id;
    this.memberService.getMemberProfileById(id).subscribe({
      next: (res: any) => {
        this.filterMemberViewData = res;
      },
      complete: () => {
        this.isMemberViewLoading = false;
        this.viewMemberId = '';
        let viewModal: HTMLElement = document.getElementById(
          'adminModal'
        ) as HTMLElement;
        if (viewModal) {
          viewModal.click();
        }
         this.viewMemberId = '';
      },
      error: (error: any) => {
        this.toastr.error(error.error.Error.Detail, error.error.Error.Title);
      },
    });
  }



  toggleOpen(id: number) {
    this.openedUserId = this.openedUserId === id ? null : id;
  }

  public makeApprove(id:string, approvalType:number){
    this.isApprovalLoading = true;
    this._adminService.memberApproval(id,approvalType).subscribe({
      next:()=>{
        this.loadUsers();
      },
      complete:()=>{
          this.isApprovalLoading = false;
          this.toastr.success(approvalType === 1 ? 'Approval Rejected Successfully' : 'Approval Successfully', 'Success');
      },
       error: (error: any) => {
         this.isApprovalLoading = false;
        this.toastr.error(error.error.Error.Detail, error.error.Error.Title);
      },
    })
  }

  public removeApprove(id:string){

  }
}
