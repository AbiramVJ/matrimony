import { Component, EventEmitter, Input, Output } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../../common/common-imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Education, UserEducationDetails, UserProfile } from '../../../../../../models/index.model';
import { MemberService } from '../../../../../../services/member.service';
import { ToastrService } from 'ngx-toastr';
import { incomeTypeList, sectorList } from '../../../../../../helpers/data';

@Component({
  selector: 'app-education-details-form',
  imports: [COMMON_DIRECTIVES, FORM_MODULES],
  templateUrl: './education-details-form.component.html',
  styleUrl: './education-details-form.component.scss'
})
export class EducationDetailsFormComponent {
  @Output() userEducationEmitter = new EventEmitter<UserEducationDetails>();
  @Input() isEditFrom:boolean = false;
  @Input() memberProfile!:UserProfile;
  public userEducationFrom!:FormGroup;
  public isSubmitted:boolean = false;
  public isLoading: boolean = false;

  public educationList:Education[] = [];
  public sectorList = sectorList;
  public incomeTypeList = incomeTypeList

  public currencies = [
    {id:1, label: '₹ (INR)', value: 'INR' },
    {id:2, label: '$ (USD)', value: 'USD' },
    {id:3, label: '€ (EUR)', value: 'EUR' },
    // Add more currencies as needed
  ];


  public jobTypeList:Education[] = []
  public selectedEducation:string = '';
  public selectedSector:number = 0;
  public selectedJob:string = '';
  public selectedCurrency:number = 0;
  public selectedIncomeType:number = 0;
  constructor(private fb:FormBuilder,private memberService:MemberService,
      private toastr: ToastrService){this.educationFormInit();}

  ngOnInit(): void {
    this._getEducationQualification();
    this._getJobType();
    this.scrollToTop();
  }
  private scrollToTop(): void {
   window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public educationFormInit(){
    this.userEducationFrom = this.fb.group({
      highestEducation:[''],
      qualification:[{ value: '', disabled: true }, Validators.required],
      institute:[{ value: '', disabled: true }, Validators.required],
      jobTitle:[{ value: '', disabled: true },Validators.required],
      companyName:[{ value: '', disabled: true },Validators.required],
      sector:[''],
      jobType:[''],
      salaryDetails:[null],
      currency:[''],
      isYearly:[{ value: '', disabled: true }],
      isVisible:[{ value: '', disabled: true }]
    })
  }


  private _getEducationQualification(){
    this.isLoading = true;
    this.memberService.getEducationQualification().subscribe({
      next:(res:Education[]) => {
        this.educationList = res;
        if(!this.isEditFrom){
        //  this.selectedEducation = res[0].id;
        }
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
        if(!this.isEditFrom){
        //  this.selectedJob = res[0].id;
        }
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
    console.log(this.userEducationFrom.valid);
    console.log(this.userEducationFrom.value)
    this.isSubmitted = true;
    let currency;
     if (this.selectedCurrency) {
      currency = this.currencies.find((c: any) => c.id === this.selectedCurrency);
    }

    if(this.userEducationFrom.valid){
      const formValue = this.userEducationFrom.value;
      const userEducationValue:UserEducationDetails = {
        highestEducation:this.selectedEducation ?? null,
        qualification:this.selectedEducation ? formValue.qualification : null,
        institute:this.selectedEducation ?formValue.institute : null,

        jobTitle: this.selectedSector ? formValue.jobTitle : null,
        companyName:this.selectedSector ? formValue.companyName : null,
        sector:this.selectedSector,
        jobType: this.selectedSector? this.selectedJob : null,

        salaryDetails:formValue.salaryDetails,
        currency:currency ? currency!.label : null,
        isYearly:formValue.salaryDetails !== null && formValue.salaryDetails !== '' ? formValue.isYearly : null,
        isVisible:formValue.isVisible ? formValue.isVisible: null,
      }
      if(!this.isEditFrom){
        this.userEducationEmitter.emit(userEducationValue);
      }else{
        this.isLoading = true;
        const updatedProfile = {
            ...this.memberProfile,
            profileJob: this.selectedSector ? {
            id:this.memberProfile.profileJob.id,
            title: this.selectedSector ? formValue.jobTitle : null,
            companyName: this.selectedSector ? formValue.companyName : null,
            sector: this.selectedSector,
            jobTypeId: this.selectedJob,
            profileSalary: {
              isAnnual:formValue.salaryDetails !== null && formValue.salaryDetails !== '' ? formValue.isYearly : null,
              amount: formValue.salaryDetails,
              currencyCode: currency ? currency!.label : null,
              isVisible: formValue.isVisible,
            }
        } : null,
        profileEducations: this.selectedEducation ? [
            {
              qualification: this.selectedEducation ?  formValue.qualification : null,
              institute: this.selectedEducation ?formValue.institute : null,
              sortNo: 0,
              educationQualificationId: this.selectedEducation,
            }
          ] : null
        }

        this.memberService.updateMemberProfile(this.memberProfile.id, updatedProfile).subscribe({
          next:(res:any) => {},
          complete:()=>{
            this.isLoading = false;
            this.toastr.success("Update successfully",'success');
          },
          error:(error:any) => {
            this.isLoading = false;
            this.toastr.error(error.error.Error.Detail,error.error.Error.Title);
          }
        })
      }
    }
  }

  ngOnChanges(){

    let currencyCode = this.currencies.find((c:any) => c.label === this.memberProfile.profileJob.profileSalary.currencyCode);
    this.selectedEducation = this.memberProfile.profileEducations[0].educationQualificationId;
    this.userEducationFrom.get('qualification')?.patchValue( this.memberProfile.profileEducations[0].qualification);
    this.userEducationFrom.get('institute')?.patchValue( this.memberProfile.profileEducations[0].institute);

    this.selectedJob = this.memberProfile.profileJob.jobTypeId;
    this.selectedSector = this.memberProfile.profileJob.sector;
    this.selectedCurrency = currencyCode?.id || 1;
    this.userEducationFrom.get('companyName')?.patchValue( this.memberProfile.profileJob.companyName);
    this.userEducationFrom.get('jobTitle')?.patchValue( this.memberProfile.profileJob.title);

    this.userEducationFrom.get('salaryDetails')?.patchValue( this.memberProfile.profileJob.profileSalary.amount);
    this.userEducationFrom.get('isYearly')?.patchValue( this.memberProfile.profileJob.profileSalary.isAnnual);
    this.userEducationFrom.get('isVisible')?.patchValue( this.memberProfile.profileJob.profileSalary.isVisible);

    this.changeHightEduction();
    this.changeJobSector();
    this.changeSalary();


  }


  // VALIDATION REMOVE AND ADD
 public changeHightEduction() {
  const highestEducation = this.userEducationFrom.get('highestEducation');
  const qualification = this.userEducationFrom.get('qualification');
  const institute = this.userEducationFrom.get('institute');

  if (this.selectedEducation !== null) {

    qualification?.addValidators(Validators.required);
    institute?.addValidators(Validators.required);

    qualification?.enable();
    institute?.enable();
  } else {

    qualification?.removeValidators(Validators.required);
    institute?.removeValidators(Validators.required);


    qualification?.patchValue(null);
    institute?.patchValue(null);

    qualification?.disable(); // <-- Disable field
    institute?.disable();     // <-- Disable field
  }


  qualification?.updateValueAndValidity();
  institute?.updateValueAndValidity();
}


public changeJobSector(){
  const title = this.userEducationFrom.get('jobTitle');
  const companyName = this.userEducationFrom.get('companyName');
  if (this.selectedSector !== null) {
      title?.addValidators(Validators.required);
      companyName?.addValidators(Validators.required);
     // this.selectedJob = this.jobTypeList[0].id;
      title?.enable();
      companyName?.enable();

    } else {
      title?.removeValidators(Validators.required);
      companyName?.removeValidators(Validators.required);
      title?.patchValue(null);
      companyName?.patchValue(null);
      this.selectedJob = '';
      title?.disable();
      companyName?.disable();

    }
    title?.updateValueAndValidity();
    companyName?.updateValueAndValidity();
  }

public changeSalary(){
    const salary = this.userEducationFrom.get('salaryDetails')!;
    const isYearly = this.userEducationFrom.get('isYearly')!;
    const isVisible = this.userEducationFrom.get('isVisible')!;
    if(salary.value !== null && salary.value.toString().trim() !== ''){
     salary.addValidators(Validators.required);
     isYearly.addValidators(Validators.required);
     isVisible.addValidators(Validators.required);
     isYearly.enable();
     isVisible.enable();
    }else{
      this.selectedCurrency = 0;
      isYearly.removeValidators(Validators.required);
      isVisible.removeValidators(Validators.required);
      salary.removeValidators(Validators.required);
      isVisible.patchValue(false);
      isYearly.patchValue(false);
      salary.patchValue(null);
      isYearly.disable();
      isVisible.disable();
    }
    isYearly.updateValueAndValidity();
    isVisible.updateValueAndValidity();
    salary.updateValueAndValidity();
  }

}

