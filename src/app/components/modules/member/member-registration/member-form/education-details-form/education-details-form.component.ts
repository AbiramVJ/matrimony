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
  public selectedSector:number = 1;
  public selectedJob:string = '';
  public selectedCurrency:number = 1;
  public selectedIncomeType:number = 1;
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
        if(!this.isEditFrom){
          this.selectedEducation = res[0].id;
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
          this.selectedJob = res[0].id;
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
    this.isSubmitted = true;
    let currency;
     if (this.selectedCurrency) {
      currency = this.currencies.find((c: any) => c.id === this.selectedCurrency);
    }

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
        currency:currency!.label,
        isYearly:formValue.isYearly,
        isVisible:formValue.isVisible
      }
      if(!this.isEditFrom){
        this.userEducationEmitter.emit(userEducationValue);
      }else{
        this.isLoading = true;
        const updatedProfile = {
            ...this.memberProfile,
            profileJob: {
            id:this.memberProfile.profileJob.id,
            title: formValue.jobTitle,
            companyName: formValue.companyName,
            sector: this.selectedSector,
            jobTypeId: this.selectedJob,
            profileSalary: {
              isAnnual: formValue.isYearly,
              amount: formValue.salaryDetails,
              currencyCode: currency!.label,
              isVisible: formValue.isVisible
            }
        },
        profileEducations: [
            {
              qualification: formValue.qualification,
              institute: formValue.institute,
              sortNo: 0,
              educationQualificationId: this.selectedEducation,
            }
          ]
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

  }
}
