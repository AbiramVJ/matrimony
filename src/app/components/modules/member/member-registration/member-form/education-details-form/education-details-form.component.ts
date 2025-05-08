import { Component, EventEmitter, Output } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../../common/common-imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserEducationDetails } from '../../../../../../models/index.model';

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

  public educationList = [{id:1, name:'BICT'}];
  public sectorList = [{id:1, name:'Government'}, {id:2, name:'Private'}];
  public incomeTypeList = [{id:1, name:'monthly'}, {id:2, name:'yearly'}]

  public currencies = [
    {id:1, label: '₹ (INR)', value: 'INR' },
    {id:2, label: '$ (USD)', value: 'USD' },
    {id:3, label: '€ (EUR)', value: 'EUR' },
    // Add more currencies as needed
  ];


  public jobType = [{id:1,name:'Doctor'}]
  public selectedEducation:number = 1;
  public selectedSector:number = 1;
  public selectedJob:number = 1;
  public selectedCurrency:number = 1;
  public selectedIncomeType:number = 1;
  constructor(private fb:FormBuilder){this.educationFormInit();}

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
      isYearly:[1],
    })
  }

  public next(){
    this.isSubmitted = true;

    if(this.userEducationFrom.valid){
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
        currency:this.selectedCurrency,
        isYearly:formValue.isYearly
      }
      this.userEducationEmitter.emit(userEducationValue);
    }
  }
}
