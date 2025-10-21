import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../../services/admin.service';
import { sortedBy, sortedDirection, subscriptionTypeList } from './../../../../../helpers/data';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectComponent } from "@ng-select/ng-select";
import { User } from '../../../../../models/member/user.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, NgSelectComponent, NgxPaginationModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  public totalItemCount:number = 0;
  public userList:User[] = [];

  public searchText:string = '';
  public deleteUserId:string = '';

  public itemsPerPage: number = 6;
  public currentPage: number = 1;
  public isLoading:boolean = false;

  public selectedStatus:number = 0;
  public selectedSortBy:number = 0;
  public selectedDirection:number = 0;

  public subscriptionTypes = subscriptionTypeList;
  public sortedBy = sortedBy;
  public sortedDirection = sortedDirection;

  public searchValue = new BehaviorSubject<any>(null);

  constructor(private _adminService:AdminService) { }

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
}
