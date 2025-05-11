import { Component, EventEmitter, Output } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../../common/common-imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Education, UserEducationDetails } from '../../../../../../models/index.model';
import { MemberService } from '../../../../../../services/member.service';

@Component({
  selector: 'app-education-details-form',
  imports: [COMMON_DIRECTIVES, FORM_MODULES],
  templateUrl: './education-details-form.component.html',
  styleUrl: './education-details-form.component.scss'
})
export class EducationDetailsFormComponent {
  @Output() userEducationEmitter = new EventEmitter<UserEducationDetails>();
  public userEducationFrom!:FormGroup;
  public isSubmitted:boolean = false;
  public isLoading: boolean = false;

  public educationList:Education[] = [];
  public sectorList = [{id:1, name:'Government'}, {id:2, name:'Private'}];
  public incomeTypeList = [{id:1, name:'monthly'}, {id:2, name:'yearly'}]

  public currencies = [
    {id:1, label: '₹ (INR)', value: 'INR' },
    {id:2, label: '$ (USD)', value: 'USD' },
    {id:3, label: '€ (EUR)', value: 'EUR' },
    // Add more currencies as needed
  ];


  public jobTypeList:Education[] = []
  public selectedEducation:string = '';
  public selectedSector:number = 1;
  public selectedJob:string = '';
  public selectedCurrency:number = 1;
  public selectedIncomeType:number = 1;
  constructor(private fb:FormBuilder,private memberService:MemberService){this.educationFormInit();}

  ngOnInit(): void {
    this._getEducationQualification();
    this._getJobType();
  }

  public educationFormInit(){
    this.userEducationFrom = this.fb.group({
      highestEducation:[''],
      qualification:['', Validators.required],
      institute:['', Validators.required],
      jobTitle:['',Validators.required],
      companyName:['',Validators.required],
      sector:[''],
      jobType:[''],
      salaryDetails:['',Validators.required],
      currency:[''],
      isYearly:[true],
      isVisible:[true]
    })
  }


  private _getEducationQualification(){
    this.isLoading = true;
    this.memberService.getEducationQualification().subscribe({
      next:(res:Education[]) => {
        this.educationList = res;
        this.selectedEducation = res[0].id;

      },
      complete:() => {
        this.isLoading = false;
      },
      error:(error:Error) => {
        this.isLoading = false;
      }
    })
  }
  private _getJobType(){
    this.isLoading = true;
    this.memberService.getJobType().subscribe({
      next:(res:Education[]) => {
        this.jobTypeList = res;
        this.selectedJob = res[0].id;

      },
      complete:() => {
        this.isLoading = false;
      },
      error:(error:Error) => {
        this.isLoading = false;
      }
    })
  }

  public next(){
    this.isSubmitted = true;
    let currency;
     if (this.selectedCurrency) {
      currency = this.currencies.find((c: any) => c.id === this.selectedCurrency);
    }

    if(this.userEducationFrom.valid){
      this.isLoading = true;
      const formValue = this.userEducationFrom.value;
      const userEducationValue:UserEducationDetails = {
        highestEducation:this.selectedEducation,
        qualification:formValue.qualification,
        institute:formValue.institute,
        jobTitle:formValue.jobTitle,
        companyName:formValue.companyName,
        sector:this.selectedSector,
        jobType:this.selectedJob,
        salaryDetails:formValue.salaryDetails,
        currency:currency!.label,
        isYearly:formValue.isYearly,
        isVisible:formValue.isVisible
      }
      this.userEducationEmitter.emit(userEducationValue);
      this.isLoading = false;
    }
  }
}
