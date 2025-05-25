import { SubCommunity } from './../../models/member/community.model';
import { MemberService } from './../../services/member.service';
import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { DataProviderService } from '../../services/data-provider.service';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../common-imports';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { bodyTypes, Complexion, diet, DrinkHabit, knownLanguages, Natshathira, raasiList, sectorList, SmokeHabit, willingToRelocate } from '../../helpers/data';
import { Community, Education, Religion } from '../../models/index.model';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, COMMON_DIRECTIVES,FORM_MODULES,NgxSliderModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  public countryList: any[] = [];
  public selectedCountry: any;
  public minAgeValue: number = 18;
  public maxAgeValue: number = 60;

  public minHeightValue: number = 0.5;
  public maxHeightValue: number = 3;


  public minWeightValue: number = 25;
  public maxWeightValue: number = 150;

  public minSalaryValue: number = 0;
  public maxSalaryValue: number = 1000000;


  public ageOptions: Options = {
    floor: 18,
    ceil: 60,
    step: 1
  };

  public HeightOptions: Options = {
    floor: 0.5,
    ceil: 3,
    step: 0.1
  };

  public weightOptions: Options = {
    floor: 25,
    ceil: 150,
    step: 0.1
  };

    public salaryOptions: Options = {
    floor: 0,
    ceil: 1000000,
    step: 10000
  };

  public dietList = diet;
  public drinkHabitList = DrinkHabit;
  public SmokeHabitList = SmokeHabit;
  public welcomeRelocateList = willingToRelocate;
  public bodyTypeList = bodyTypes;
  public complexionList = Complexion;
  public natshathiraList = Natshathira;
  public religionList:Religion [] = [];
  public communityList:Community[] = [];
  public SubCommunityList:SubCommunity[] = [];
  public knownLanguagesList = knownLanguages;
  public sectorList = sectorList;
  public jobTypeList:Education[] = []
  public educationList:Education[] = [];
  public rasiList = raasiList;

  public foodHabit: number[] = [];
  public drinkHabit: number[] = [];
  public smokeHabit: number[] = [];
  public welcomeRelocate: number[] = [];
  public bodyType: number[] = [];
  public complexion: number[] = [];
  public natshathira: number[] = [];
  public religion: string[] = [];
  public community: string[] = [];
  public subCommunity: string[] = [];
  public knownLanguages: string[] = [];
  public sector: number[] = [];
  public jobType:string[] = [];
  public education:string[] = [];
  public rasi:number[] = [];



  public isLoading:boolean = false;

  constructor( private dataProvider: DataProviderService,private memberService:MemberService){
    this.countryList = this.dataProvider.getPhoneCode();
    effect(() => {
      const userGeoLocationDetails = this.dataProvider.userGeoLocation();
      const defaultCountryCode = this.countryList.find(
        (pc: any) => pc.iso === userGeoLocationDetails?.country_code
      );
      if (defaultCountryCode) {
        this.selectedCountry = defaultCountryCode.country;

      }
    });
  }

  public ngOnInit(): void {
    this._getReligion();
    this._getCommunity();
    this._getJobType();
    this._getEducationQualification();

  }

  ngAfterViewInit(){
    let deleteModal: HTMLElement = document.getElementById('default-coll') as HTMLElement;
    if(deleteModal){
      deleteModal.click();
    }
  }


public onDietChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const id = +checkbox.value;

  if (checkbox.checked) {
    if (!this.foodHabit.includes(id)) {
      this.foodHabit.push(id);
    }
  } else {
    this.foodHabit = this.foodHabit.filter(val => val !== id);
  }
}

public onDrinkChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const id = +checkbox.value;

  if (checkbox.checked) {
    if (!this.drinkHabit.includes(id)) {
      this.drinkHabit.push(id);
    }
  } else {
    this.drinkHabit = this.drinkHabit.filter(val => val !== id);
  }
}

public onSmokeChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const id = +checkbox.value;

  if (checkbox.checked) {
    if (!this.smokeHabit.includes(id)) {
      this.smokeHabit.push(id);
    }
  } else {
    this.smokeHabit = this.smokeHabit.filter(val => val !== id);
  }
}

public onRelocateChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const id = +checkbox.value;

  if (checkbox.checked) {
    if (!this.welcomeRelocate.includes(id)) {
      this.welcomeRelocate.push(id);
    }
  } else {
    this.welcomeRelocate = this.welcomeRelocate.filter(val => val !== id);
  }
}

public onBodyTypeChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const id = +checkbox.value;

  if (checkbox.checked) {
    if (!this.bodyType.includes(id)) {
      this.bodyType.push(id);
    }
  } else {
    this.bodyType = this.bodyType.filter(val => val !== id);
  }
}


public onComplexionChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const id = +checkbox.value;

  if (checkbox.checked) {
    if (!this.complexion.includes(id)) {
      this.complexion.push(id);
    }
  } else {
    this.complexion = this.complexion.filter(val => val !== id);
  }
}

public onReligionChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const id = +checkbox.value;

  if (checkbox.checked) {
    if (!this.religion.includes(id.toString())) {
      this.religion.push(id.toString());
    }
  } else {
    this.religion = this.religion.filter(val => val !== id.toString());
  }
}

public onCommunityChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const id = +checkbox.value;

  if (checkbox.checked) {
    if (!this.community.includes(id.toString())) {
      this.community.push(id.toString());
    }
  } else {
    this.community = this.community.filter(val => val !== id.toString());
  }
}

public onSubCommunityChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const id = +checkbox.value;

  if (checkbox.checked) {
    if (!this.subCommunity.includes(id.toString())) {
      this.subCommunity.push(id.toString());
    }
  } else {
    this.subCommunity = this.subCommunity.filter(val => val !== id.toString());
  }
}

public onKnowLanguageChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const id = +checkbox.value;

  if (checkbox.checked) {
    if (!this.knownLanguages.includes(id.toString())) {
      this.knownLanguages.push(id.toString());
    }
  } else {
    this.knownLanguages = this.knownLanguages.filter(val => val !== id.toString());
  }
}

public onJobSectorChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const id = +checkbox.value;

  if (checkbox.checked) {
    if (!this.sector.includes(id)) {
      this.sector.push(id);
    }
  } else {
    this.sector = this.sector.filter(val => val !== id);
  }
}

public onJobTypeChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const id = +checkbox.value;

  if (checkbox.checked) {
    if (!this.sector.includes(id)) {
      this.sector.push(id);
    }
  } else {
    this.sector = this.sector.filter(val => val !== id);
  }
}

public onEducationChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const id = +checkbox.value;

  if (checkbox.checked) {
    if (!this.education.includes(id.toString())) {
      this.education.push(id.toString());
    }
  } else {
    this.education = this.education.filter(val => val !== id.toString());
  }
}

public onNatsathiraChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const id = +checkbox.value;

  if (checkbox.checked) {
    if (!this.natshathira.includes(id)) {
      this.natshathira.push(id);
    }
  } else {
    this.natshathira = this.natshathira.filter(val => val !== id);
  }
}

public onRasiChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const id = +checkbox.value;

  if (checkbox.checked) {
    if (!this.rasi.includes(id)) {
      this.rasi.push(id);
    }
  } else {
    this.rasi = this.rasi.filter(val => val !== id);
  }
}
//========================================= API CALL ======================================#
 private _getReligion(){
    this.isLoading = true;
    this.memberService.getReligion().subscribe({
      next:(res:Religion[]) => {
        this.religionList = res;
      },
      complete:() => {
        this.isLoading = false;
      },
      error:(error:Error) => {
        this.isLoading = false;
      }
    })
  }

   private _getCommunity(){
    this.isLoading = true;
    this.memberService.getCommunity().subscribe({
      next:(res:Community[]) => {
        this.communityList = res;
        this.SubCommunityList = res[0].subCommunities;

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
      },
      complete:() => {
        this.isLoading = false;
      },
      error:(error:Error) => {
        this.isLoading = false;
      }
    })
  }

  private _getEducationQualification(){
    this.isLoading = true;
    this.memberService.getEducationQualification().subscribe({
      next:(res:Education[]) => {
        this.educationList = res;

      },
      complete:() => {
        this.isLoading = false;
      },
      error:(error:Error) => {
        this.isLoading = false;
      }
    })
  }


}
