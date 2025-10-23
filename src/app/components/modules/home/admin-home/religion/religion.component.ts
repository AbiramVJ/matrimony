import { Component } from '@angular/core';
import { Religion } from '../../../../../models/index.model';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../common/common-imports';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from "../../../../../common/loading/loading.component";

@Component({
  selector: 'app-religion',
  imports: [COMMON_DIRECTIVES, NgxPaginationModule, FORM_MODULES, LoadingComponent],
  templateUrl: './religion.component.html',
  styleUrl: './religion.component.scss'
})
export class ReligionComponent {
  public totalItemCount:number = 0;
  public itemsPerPage: number = 6;
  public currentPage: number = 1;
  public isLoading:boolean = false;
  public isSubmitted:boolean = false;
  public isUpdate:boolean = false;
  public religionList: Religion[] = [];
  public deletedId:string = '';
  public updatedId:string = '';

  public religionFrom!:FormGroup;

  constructor(private _adminService:AdminService, private fb:FormBuilder, private toastr: ToastrService){
    this._getAllReligion();
    this._editReligionFromInit();
  }

  public createReligionPopUp(){
    this.isUpdate = false;
  }

  private _editReligionFromInit(){
    this.religionFrom = this.fb.group({
      name:['', Validators.required]
    })
  }


  public setReligion(religion:any){
    this.isUpdate = true;
    this.religionFrom.get('name')?.patchValue(religion.name);
    this.updatedId = religion.id;
  }


   public changePerPageValue(pageNumber: number) {
    if (pageNumber != 0 && pageNumber != null) {
      this.currentPage = 1;
      this.itemsPerPage = pageNumber;
      this._getAllReligion();
    }
  }

  public pageChanged(event: any) {
    this.currentPage = event;
    this._getAllReligion();
  }

  private _getAllReligion(){
    this.isLoading = true;
    this._adminService.getReligionWithPagination(this.currentPage, this.itemsPerPage).subscribe({
      next:(res:any) => {
        this.religionList = res.data;
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

    public _editReligion(){
    this.isSubmitted = true;
    this.isLoading = true;
    if(this.religionFrom.valid){
    let body = {
      name:this.religionFrom.get('name')?.value,
      isActive:true
    }
      this._adminService.editReligion(this.updatedId,body).subscribe({
        next:()=>{},
        complete:()=>{
          this.toastr.success("Religion Updated", "Success");
           let viewModal: HTMLElement = document.getElementById('religion-modal-btn') as HTMLElement;
           if (viewModal) { viewModal.click();}
           this.religionFrom.reset();
           this.isSubmitted = false;
           this.isUpdate = false;
           this.updatedId = '';
           this._getAllReligion();
        },
        error:(error:any)=>{
           this.isLoading = false;
           this.isSubmitted = false;
           this.isUpdate = false;
        }
      })
    }
  }

  public createReligion(){
    this.isSubmitted = true;
    this.isLoading = true;
    if(this.religionFrom.valid){
      let body = {
        name:this.religionFrom.get('name')?.value,
        isActive:true
      }
      this._adminService.createReligion(body).subscribe({
        next:()=>{},
        complete:()=>{
           this.toastr.success("Religion created", "Success");
           let viewModal: HTMLElement = document.getElementById('religion-modal-btn') as HTMLElement;
           if (viewModal) { viewModal.click();}
           this.religionFrom.reset();
           this.isSubmitted = false;
           this._getAllReligion();
        },
        error:(error:any)=>{
           this.isLoading = false;
           this.isSubmitted = false;
        }
      })
    }
  }

  public deleteReligion(){
    this.isLoading = true;
    this._adminService.deleteReligion(this.deletedId).subscribe({
      next:(res:any) => {},
      complete:()=>{
        this.toastr.success("Religion Deleted", "Success");
        this.deletedId = '';
        this.isLoading = false;
        let viewModal: HTMLElement = document.getElementById('deleted-close-btn') as HTMLElement;
        if (viewModal) { viewModal.click();}
        this._getAllReligion();
      },
      error:(error:any)=>{
        this.isLoading = false;
        this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
      }
    })
  }


}
