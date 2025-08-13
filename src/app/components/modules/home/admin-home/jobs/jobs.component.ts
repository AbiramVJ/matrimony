import { Component } from '@angular/core';
import { Education } from '../../../../../models/index.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../../services/admin.service';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../common/common-imports';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-jobs',
  imports: [COMMON_DIRECTIVES,NgxPaginationModule,FORM_MODULES],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent {

  public totalItemCount:number = 0;
  public itemsPerPage: number = 6;
  public currentPage: number = 1;
  public isLoading:boolean = false;
  public isSubmitted:boolean = false;
  public isUpdate:boolean = false;
  public jobList: Education[] = [];
  public deletedId:string = '';
  public updatedId:string = '';

  public jobFrom!:FormGroup;

  constructor(private _adminService:AdminService, private fb:FormBuilder, private toastr: ToastrService){

  }
  ngOnInit(): void {
    this._getAllJob();
    this._editJobFromInit();
  }

  public createJobPopUp(){
    this.isUpdate = false;
  }

  public setJob(job:any){
    this.isUpdate = true;
    this.jobFrom.get('name')?.patchValue(job.name);
    this.updatedId = job.id;
  }

  private _editJobFromInit(){
    this.jobFrom = this.fb.group({
      name:['', Validators.required]
    })
  }

   public changePerPageValue(pageNumber: number) {
    if (pageNumber != 0 && pageNumber != null) {
      this.currentPage = 1;
      this.itemsPerPage = pageNumber;
      this._getAllJob();
    }
  }

  public pageChanged(event: any) {
    this.currentPage = event;
    this._getAllJob();
  }

  private _getAllJob(){
  this.isLoading = true;
    this._adminService.getJobWithPagination(this.currentPage, this.itemsPerPage).subscribe({
      next:(res:any) => {
        this.jobList = res.data;
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

  public _editJob(){
    this.isSubmitted = true;
    this.isLoading = true;
    if(this.jobFrom.valid){
    let body = {
      name:this.jobFrom.get('name')?.value,
      isActive:true
    }
      this._adminService.editJob(this.updatedId,body).subscribe({
        next:()=>{},
        complete:()=>{
          this.toastr.success("Job Updated", "Success");
           let viewModal: HTMLElement = document.getElementById('job-modal-btn') as HTMLElement;
           if (viewModal) { viewModal.click();}
           this.jobFrom.reset();
           this.isSubmitted = false;
           this.isUpdate = false;
           this.updatedId = '';
           this._getAllJob();
        },
        error:(error:any)=>{
           this.isLoading = false;
           this.isSubmitted = false;
           this.isUpdate = false;
        }
      })
    }
  }

  public createJob(){
    this.isSubmitted = true;
    this.isLoading = true;
    if(this.jobFrom.valid){
      let body = {
        name:this.jobFrom.get('name')?.value,
        isActive:true
      }
      this._adminService.createJob(body).subscribe({
        next:()=>{},
        complete:()=>{
           this.toastr.success("Education created", "Success");
           let viewModal: HTMLElement = document.getElementById('job-modal-btn') as HTMLElement;
           if (viewModal) { viewModal.click();}
           this.jobFrom.reset();
           this.isSubmitted = false;
           this._getAllJob();
        },
        error:(error:any)=>{
           this.isLoading = false;
           this.isSubmitted = false;
        }
      })
    }
  }

  public deleteJob(){
    this.isLoading = true;
    this._adminService.deleteJob(this.deletedId).subscribe({
      next:(res:any) => {},
      complete:()=>{
        this.toastr.success("Job Deleted", "Success");
        this.deletedId = '';
        this.isLoading = false;
        let viewModal: HTMLElement = document.getElementById('deleted-close-btn') as HTMLElement;
        if (viewModal) { viewModal.click();}
        this._getAllJob();
      },
      error:(error:any)=>{
        this.isLoading = false;
        this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
      }
    })
  }
}
