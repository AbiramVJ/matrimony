import { SubCommunity } from './../../models/member/community.model';
import { MemberService } from './../../services/member.service';
import { CommonModule } from '@angular/common';
import { Component, effect, ViewEncapsulation } from '@angular/core';
import { DataProviderService } from '../../services/data-provider.service';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../common-imports';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { bodyTypes, Complexion, currencies, diet, DrinkHabit, knownLanguages, maritalStatusOptions, Natshathira, raasiList, sectorList, SmokeHabit, willingToRelocate } from '../../helpers/data';
import { Community, Education, Religion } from '../../models/index.model';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, COMMON_DIRECTIVES,FORM_MODULES,NgxSliderModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SideBarComponent {
  public countryList: any[] = [];
  public selectedCountry: any;
  public selectedLivingCountry: any;
  public selectedReligion :any;
  public selectedCommunity:any;
  public selectedSubCommunity:any;
  public selectedJobType:any;
  public selectedEducation:any;
  public selectedKnowLanguages:any;
  public selectedCurrency:any;
  public selectedMarriageStatus:any;


  public minAgeValue: number = 0;
  public maxAgeValue: number = 300;

  public minHeightValue: number = 0;
  public maxHeightValue: number = 300;


  public minWeightValue: number = 0;
  public maxWeightValue: number = 300;

  public minSalaryValue: number = 0;
  public maxSalaryValue: number = 10000000000;


  public ageOptions: Options = {
    floor: 18,
    ceil: 60,
    step: 1
  };



  public HeightOptions: Options = {
    floor: 0,
    ceil: 300,
    step: 5
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
  public currencyList = currencies;
  public religionList:Religion [] = [];
  public communityList:Community[] = [];
  public SubCommunityList:SubCommunity[] = [];
  public knownLanguagesList = knownLanguages;
  public sectorList = sectorList;
  public jobTypeList:Education[] = []
  public educationList:Education[] = [];
  public rasiList = raasiList;
  public marriageStatusList = maritalStatusOptions;

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
        this.selectedCountry = [defaultCountryCode.country];
        this.selectedLivingCountry = [defaultCountryCode.country];

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
  this.applyFilters();
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
  this.applyFilters();
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
  this.applyFilters();
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
  this.applyFilters();
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
  this.applyFilters();
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
  this.applyFilters();
}

public onJobSectorChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const id = +checkbox.value;
  console.log(id);
  if (checkbox.checked) {
    if (!this.sector.includes(id)) {
      this.sector.push(id);
    }
  } else {
    this.sector = this.sector.filter(val => val !== id);
  }
  this.applyFilters();
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
  this.applyFilters();
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
  this.applyFilters();
}

public ngSelectChange(){
  this.applyFilters();
}
//========================================= API CALL ======================================#
 private _getReligion(){
    this.isLoading = true;
    this.memberService.getReligion().subscribe({
      next:(res:Religion[]) => {
        this.religionList = res;
     //   this.selectedReligion = [res[0].id];
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
     //   this.selectedCommunity = [res[0].id];
        //this.selectedSubCommunity = [res[0].subCommunities[0].id];
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
         this.applyFilters();
      },
      error:(error:Error) => {
        this.isLoading = false;
      }
    })
  }

  public applyFilters() {
    const filterPayload = {
      minAge: this.minAgeValue,
      maxAge: this.maxAgeValue,
      OriginCountries: this.selectedCountry,
      LivingCountries: this.selectedLivingCountry,
      foodHabits: this.foodHabit,
      drinkHabits: this.drinkHabit,
      smokeHabits: this.smokeHabit,
      marriageStatus: this.selectedMarriageStatus,
      bodyTypes: this.bodyType,
      willingToRelocate: this.welcomeRelocate,
      skinComplexions: this.complexion,
      minHeight: this.minHeightValue,
      maxHeight: this.maxHeightValue,
      minWeight: this.minWeightValue,
      maxWeight: this.maxWeightValue,
      knownLanguages: this.selectedKnowLanguages,
      religionIds: this.selectedReligion,
      communityIds: this.selectedCommunity,
      subCommunityIds: this.selectedSubCommunity,
      jobSectors: this.sector,
      jobTypeIds: this.selectedJobType,
      educationQualificationIds: this.selectedEducation,
      nakshathiram: this.natshathira,
      raasi: this.rasi,
      salaryFilter: this.selectedCurrency ? {
        currencyCode: this.selectedCurrency,
        minMonthlyAmount: this.minSalaryValue,
        maxMonthlyAmount: this.maxSalaryValue,
        } : null,
      };

    this.memberService.setFilter(filterPayload);
  }


  clearFilter() {
  this.minAgeValue = 0;
  this.maxAgeValue = 60;
  this.selectedCountry = [];
  this.selectedLivingCountry = [];
  this.foodHabit = [];
  this.drinkHabit = [];
  this.smokeHabit = [];
  this.selectedMarriageStatus = [];
  this.bodyType = [];
  this.welcomeRelocate = [];
  this.complexion = [];
  this.minHeightValue = 0;
  this.maxHeightValue = 300;
  this.minWeightValue = 0;
  this.maxWeightValue = 300;
  this.selectedKnowLanguages = [];
  this.selectedReligion = [];
  this.selectedCommunity = [];
  this.selectedSubCommunity = [];
  this.sector = [];
  this.selectedJobType = [];
  this.selectedEducation = [];
  this.natshathira = [];
  this.rasi = [];
  this.selectedCurrency = null;
  this.minSalaryValue = 0;
  this.maxSalaryValue = 1000000000;

  const emptyPayload = {
    minAge: null,
    maxAge: null,
    OriginCountries: [],
    LivingCountries: [],
    foodHabits: [],
    drinkHabits: [],
    smokeHabits: [],
    marriageStatus: [],
    bodyTypes: [],
    willingToRelocate: null,
    skinComplexions: [],
    minHeight: null,
    maxHeight: null,
    minWeight: null,
    maxWeight: null,
    knownLanguages: [],
    religionIds: [],
    communityIds: [],
    subCommunityIds: [],
    jobSectors: [],
    jobTypeIds: [],
    educationQualificationIds: [],
    nakshathiram: [],
    raasi: [],
    salaryFilter: null,
  };

  this.memberService.setFilter(emptyPayload);
}

}
