import { Component, Output, EventEmitter, Input } from '@angular/core';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../../../../../../common/common-imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { familyTypeList } from '../../../../../../helpers/data';
import { UserFamilyInfo, UserProfile } from '../../../../../../models/index.model';
import { MemberService } from '../../../../../../services/member.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-family-information-form',
  imports: [COMMON_DIRECTIVES, FORM_MODULES],
  templateUrl: './family-information-form.component.html',
  styleUrl: './family-information-form.component.scss'
})
export class FamilyInformationFormComponent {
  @Output() userFamilyEmitter = new EventEmitter<UserFamilyInfo>();
  @Input() isEditFrom:boolean = false;
  @Input() memberProfile!:UserProfile;
  public userFamilyInfoForm!:FormGroup;
  public isSubmitted:boolean = false;
  public isLoading:boolean = false;
  public familyTypeList = familyTypeList;
  public selectedFamily:number = 0;
  constructor(private fb:FormBuilder, private _memberService:MemberService,
    private toastr: ToastrService){
    this._userFamilyInfoFormInit();
  }

  private _userFamilyInfoFormInit(){
    this.userFamilyInfoForm = this.fb.group({
      fatherName:['',Validators.required],
      motherName:['',Validators.required],
      fatherOccupation:['',Validators.required],
      matherOccupation:['',Validators.required],
      siblings:['',Validators.required],
      familyType:[1]
    })
  }

  next(){
    this.isSubmitted = true;
    if(this.userFamilyInfoForm.valid){
      if(!this.isEditFrom){
        this.userFamilyEmitter.emit(this.userFamilyInfoForm.value);
      }else{
        this.isLoading = true;
        const updatedProfile = {
          ...this.memberProfile,
            profileFamily: {
              fatherName: this.userFamilyInfoForm.value.fatherName,
              fatherOccupation: this.userFamilyInfoForm.value.fatherOccupation,
              motherName: this.userFamilyInfoForm.value.motherName,
              motherOccupation: this.userFamilyInfoForm.value.matherOccupation,
              numberOfSiblings: this.userFamilyInfoForm.value.siblings,
              familyType: this.userFamilyInfoForm.value.familyType,
              id:this.memberProfile.profileFamily.id
           },
        }
        this._memberService.updateMemberProfile(this.memberProfile.id, updatedProfile).subscribe({
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

  ngOnChanges() {
    this.selectedFamily = this.memberProfile.profileFamily.familyType;
    this.userFamilyInfoForm.get('fatherName')?.patchValue(this.memberProfile.profileFamily.fatherName);
    this.userFamilyInfoForm.get('motherName')?.patchValue(this.memberProfile.profileFamily.motherName);
    this.userFamilyInfoForm.get('fatherOccupation')?.patchValue(this.memberProfile.profileFamily.fatherOccupation);
    this.userFamilyInfoForm.get('matherOccupation')?.patchValue(this.memberProfile.profileFamily.motherOccupation);
    this.userFamilyInfoForm.get('siblings')?.patchValue(this.memberProfile.profileFamily.numberOfSiblings);
    this.userFamilyInfoForm.get('siblings')?.patchValue(this.memberProfile.profileFamily.familyType);
  }
}
