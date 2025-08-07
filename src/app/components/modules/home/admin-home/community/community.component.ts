import { AdminService } from './../../../../../services/admin.service';
import { Component } from '@angular/core';
import { MemberService } from '../../../../../services/member.service';
import { Community } from '../../../../../models/index.model';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../common/common-imports';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-community',
  imports: [COMMON_DIRECTIVES,NgxPaginationModule,FORM_MODULES],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss'
})
export class CommunityComponent {

  public isLoading:boolean = false;
  public isSubmitted:boolean = false;
  public isUpdate:boolean = false;
  public updatedId:string = '';
  public communityList:Community[] = [];
  public totalItemCount: number = 0;
  public itemsPerPage: number = 6;
  public currentPage: number = 1;

  public communityFrom!:FormGroup;

  constructor(
    private memberService:MemberService,
    private fb:FormBuilder,
    private _adminService:AdminService,
    private toastr: ToastrService,
  ){

  }

  ngOnInit(): void {
    this._getCommunity();
    this.communityFormInit();
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

  private communityFormInit(){
    this.communityFrom = this.fb.group({
      name:['', [Validators.required]],
      isActive:[true]
    })
  }

  public createCommunity(){
    this.isSubmitted = true;
    this.isLoading = true;
    if(this.communityFrom.valid){
      let body = {
        name:this.communityFrom.get('name')?.value,
        isActive:true
      }
      this._adminService.createCommunity(body).subscribe({
        next:()=>{},
        complete:()=>{
          this.toastr.success("Community created", "Success");
           let viewModal: HTMLElement = document.getElementById('community-modal-btn') as HTMLElement;
           if (viewModal) { viewModal.click();}
           this.communityFrom.reset();
           this.isSubmitted = false;
           this._getCommunity();
        },
        error:(error:any)=>{
           this.isLoading = false;
           this.isSubmitted = false;
        }
      })
    }

  }

  public _editCommunity(){
    this.isSubmitted = true;
    this.isLoading = true;
    if(this.communityFrom.valid){
    let body = {
      name:this.communityFrom.get('name')?.value,
      isActive:true
    }
      this._adminService.editCommunity(this.updatedId,body).subscribe({
        next:()=>{},
        complete:()=>{
          this.toastr.success("Community Updated", "Success");
           let viewModal: HTMLElement = document.getElementById('community-modal-btn') as HTMLElement;
           if (viewModal) { viewModal.click();}
           this.communityFrom.reset();
           this.isSubmitted = false;
           this.isUpdate = false;
           this.updatedId = '';
           this._getCommunity();
        },
        error:(error:any)=>{
           this.isLoading = false;
           this.isSubmitted = false;
           this.isUpdate = false;
        }
      })
    }
  }

  public createCommunityPopUp(){
    this.isUpdate = false;
    this.communityFrom.get('name')?.patchValue(null);
  }
  public setCommunity(community:any){
    this.isUpdate = true;
    this.communityFrom.get('name')?.patchValue(community.name);
    this.updatedId = community.id;
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
