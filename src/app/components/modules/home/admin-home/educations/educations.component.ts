import { AdminService } from './../../../../../services/admin.service';
import { Component } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../common/common-imports';
import { NgxPaginationModule } from 'ngx-pagination';
import { Education } from '../../../../../models/index.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-educations',
  imports: [COMMON_DIRECTIVES,NgxPaginationModule,FORM_MODULES],
  templateUrl: './educations.component.html',
  styleUrl: './educations.component.scss'
})
export class EducationsComponent {

  public totalItemCount:number = 0;
  public itemsPerPage: number = 6;
  public currentPage: number = 1;
  public isLoading:boolean = false;
  public isSubmitted:boolean = false;
  public isUpdate:boolean = false;
  public educationList: Education[] = [];
  public deletedId:string = '';
  public updatedId:string = '';

  public educationFrom!:FormGroup;

  constructor( private _adminService:AdminService, private fb:FormBuilder, private toastr: ToastrService,){

  }

  ngOnInit(): void {
   this._getAllEducation();
   this._editEducationFromInit();
  }


  private _editEducationFromInit(){
    this.educationFrom = this.fb.group({
      name:['', Validators.required]
    })
  }

  private _getAllEducation(){
  this.isLoading = true;
    this._adminService.getEducationWithPagination(this.currentPage, this.itemsPerPage).subscribe({
      next:(res:any) => {
        this.educationList = res.data;
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

  public createEducationPopUp(){
    this.isUpdate = false;
  }

  public setEducation(education:any){
    this.isUpdate = true;
    this.educationFrom.get('name')?.patchValue(education.name);
    this.updatedId = education.id;
  }

  public changePerPageValue(pageNumber: number) {
    if (pageNumber != 0 && pageNumber != null) {
      this.currentPage = 1;
      this.itemsPerPage = pageNumber;
      this._getAllEducation();
    }
  }

  public pageChanged(event: any) {
    this.currentPage = event;
    this._getAllEducation();
  }

  public _editEducation(){
    this.isSubmitted = true;
    this.isLoading = true;
    if(this.educationFrom.valid){
    let body = {
      name:this.educationFrom.get('name')?.value,
      isActive:true
    }
      this._adminService.editEducation(this.updatedId,body).subscribe({
        next:()=>{},
        complete:()=>{
          this.toastr.success("Education Updated", "Success");
           let viewModal: HTMLElement = document.getElementById('education-modal-btn') as HTMLElement;
           if (viewModal) { viewModal.click();}
           this.educationFrom.reset();
           this.isSubmitted = false;
           this.isUpdate = false;
           this.updatedId = '';
           this._getAllEducation();
        },
        error:(error:any)=>{
           this.isLoading = false;
           this.isSubmitted = false;
           this.isUpdate = false;
        }
      })
    }
  }

  public createEducation(){
    this.isSubmitted = true;
    this.isLoading = true;
    if(this.educationFrom.valid){
      let body = {
        name:this.educationFrom.get('name')?.value,
        isActive:true
      }
      this._adminService.createEducation(body).subscribe({
        next:()=>{},
        complete:()=>{
           this.toastr.success("Education created", "Success");
           let viewModal: HTMLElement = document.getElementById('education-modal-btn') as HTMLElement;
           if (viewModal) { viewModal.click();}
           this.educationFrom.reset();
           this.isSubmitted = false;
           this._getAllEducation();
        },
        error:(error:any)=>{
           this.isLoading = false;
           this.isSubmitted = false;
        }
      })
    }
  }

  public deleteEducation(){
    this.isLoading = true;
    this._adminService.deleteEducation(this.deletedId).subscribe({
      next:(res:any) => {},
      complete:()=>{
        this.toastr.success("Education Deleted", "Success");
        this.deletedId = '';
        this.isLoading = false;
        let viewModal: HTMLElement = document.getElementById('deleted-close-btn') as HTMLElement;
        if (viewModal) { viewModal.click();}
        this._getAllEducation();
      },
      error:(error:any)=>{
        this.isLoading = false;
        this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
      }
    })
  }

}
