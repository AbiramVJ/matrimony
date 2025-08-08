import { AdminService } from './../../../../../services/admin.service';
import { Component } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../common/common-imports';
import { NgxPaginationModule } from 'ngx-pagination';
import { Education } from '../../../../../models/index.model';
import { MemberService } from '../../../../../services/member.service';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  public educationFrom!:FormGroup;

  constructor( private _adminService:AdminService, private fb:FormBuilder, private toastr: ToastrService,){

  }

  ngOnInit(): void {
   this._getAllEducation();
  }

  private _getAllEducation(){
  this.isLoading = true;
    this._adminService.getEducationWithPagination(this.currentPage, this.itemsPerPage).subscribe({
      next:(res:any) => {
        console.log(res);
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

  }

  public setEducation(education:any){

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

  }

  public createEducation(){

  }
}
