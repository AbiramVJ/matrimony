import { SubCommunity } from './../../models/member/community.model';
import { MemberService } from './../../services/member.service';
import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { DataProviderService } from '../../services/data-provider.service';
import { COMMON_DIRECTIVES, FORM_MODULES } from '../common-imports';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import {
  bodyTypes,
  Complexion,
  currency,
  diet,
  DrinkHabit,
  knownLanguages,
  maritalStatusOptions,
  Natshathira,
  raasiList,
  sectorList,
  SmokeHabit,
  willingToRelocate,
} from '../../helpers/data';
import { Community, Education, Religion } from '../../models/index.model';
import { AuthService } from '../../services/auth/auth.service';
import { BehaviorSubject, debounceTime, forkJoin } from 'rxjs';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, COMMON_DIRECTIVES, FORM_MODULES, NgxSliderModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SideBarComponent {
  @Output() newLoadEvent = new EventEmitter<boolean>();
  public searchValue = new BehaviorSubject<any>(null);
  public countryList: any[] = [];
  public selectedCountry: any;
  public selectedLivingCountry: any;
  public selectedReligion: any;
  public selectedCommunity: any;
  //public selectedSubCommunity: any;
  public selectedJobType: any;
  public selectedEducation: any;
  public selectedKnowLanguages: any;
  public selectedCurrency: any;
  public selectedMarriageStatus: any;
  private hasAppliedFilters: boolean = false;

  public minAgeValue: number = 18;
  public maxAgeValue: number = 60;

  public minHeightValue: number = 0;
  public maxHeightValue: number = 250;

  public minWeightValue: number = 25;
  public maxWeightValue: number = 150;

  public minSalaryValue: any = null;
  public maxSalaryValue: any = null;

  public searchText:string = '';

  public ageOptions: Options = {
    floor: 18,
    ceil: 60,
    step: 1,
  };

  public HeightOptions: Options = {
    floor: 100,
    ceil: 250,
    step: 5,
  };

  public weightOptions: Options = {
    floor: 25,
    ceil: 150,
    step: 0.1,
  };

  public salaryOptions: Options = {
    floor: 0,
    ceil: 1000000,
    step: 10000,
  };

  public dietList = diet;
  public drinkHabitList = DrinkHabit;
  public SmokeHabitList = SmokeHabit;
  public welcomeRelocateList = willingToRelocate;
  public bodyTypeList = bodyTypes;
  public complexionList = Complexion;
  public natshathiraList = Natshathira;
  public currencyList = currency;
  public religionList: Religion[] = [];
  public communityList: Community[] = [];
  public SubCommunityList: SubCommunity[] = [];
  public knownLanguagesList = knownLanguages;
  public sectorList = sectorList;
  public jobTypeList: Education[] = [];
  public educationList: Education[] = [];
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
  public jobType: string[] = [];
  public education: string[] = [];
  public rasi: number[] = [];
  public isLoading: boolean = false;
  public stateAndProvince: any[] = [];
  public selectedProvince: any;

  public selectedNatshathira:any;
  public selectedRasi:any;
  public isInitialLoad:boolean = false;
  constructor(
    private dataProvider: DataProviderService,
    private memberService: MemberService,
    private _authService: AuthService
  ) {
    this.countryList = this.dataProvider.getPhoneCode();
    effect(() => {
     this.isInitialLoad = memberService.isInitialLoad();
      const userGeoLocationDetails = this.dataProvider.userGeoLocation();
      const defaultCountryCode = this.countryList.find(
        (pc: any) => pc.iso === userGeoLocationDetails?.country_code
      );
      if (defaultCountryCode) {
        this.selectedLivingCountry = [defaultCountryCode.country];
        this.selectedProvince = defaultCountryCode.stateProvinces[0].name;
      }

    });
  }

  public ngOnInit(): void {
    this._loadInitialData();
    this._getCurrentMember();
     this.searchValue.pipe(debounceTime(1000)).subscribe(searchText => {
      if (searchText != null) {
        this.getSearchActivities(searchText);
      }
    });
  }

  ngAfterViewInit() {
    let deleteModal: HTMLElement = document.getElementById(
      'default-coll'
    ) as HTMLElement;
    if (deleteModal) {
      deleteModal.click();
    }
  }
  private _loadInitialData(): void {
    this.newLoadEvent.emit(true);
    this.isLoading = true;
    forkJoin({
      religions: this.memberService.getReligion(),
      communities: this.memberService.getCommunity(),
      jobTypes: this.memberService.getJobType(),
      educations: this.memberService.getEducationQualification(),
    }).subscribe({
      next: ({ religions, communities, jobTypes, educations }: any) => {
        this.religionList = religions;
        this.communityList = communities;
        this.SubCommunityList = communities[0]?.subCommunities || [];
        this.jobTypeList = jobTypes;
        this.educationList = educations;
      },
      complete: () => {

        if (!this.hasAppliedFilters) {
          this.applyFilters();
          this.hasAppliedFilters = true;
        }
        this.newLoadEvent.emit(false);
      },
      error: (err: any) => {
        console.error('Failed to load initial data', err);
        this.isLoading = false;
        this.newLoadEvent.emit(false);
      },
    });
  }

  private _getCurrentMember() {
    this._authService.member$.subscribe((data) => {
      if (data) {
        this.minAgeValue = data.profileLookingFor.minAge;
        this.maxAgeValue = data.profileLookingFor.maxAge;
        this.selectedCountry = [data.originCountry];
      }
    });
  }

  public onDietChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const id = +checkbox.value;
    if (checkbox.checked) {
      if (!this.foodHabit.includes(id)) {
        this.foodHabit.push(id);
      }
    } else {
      this.foodHabit = this.foodHabit.filter((val) => val !== id);
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
      this.drinkHabit = this.drinkHabit.filter((val) => val !== id);
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
      this.smokeHabit = this.smokeHabit.filter((val) => val !== id);
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
      this.welcomeRelocate = this.welcomeRelocate.filter((val) => val !== id);
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
      this.bodyType = this.bodyType.filter((val) => val !== id);
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
      this.complexion = this.complexion.filter((val) => val !== id);
    }
    this.applyFilters();
  }

  public onJobSectorChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const id = +checkbox.value;
    if (checkbox.checked) {
      if (!this.sector.includes(id)) {
        this.sector.push(id);
      }
    } else {
      this.sector = this.sector.filter((val) => val !== id);
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
      this.rasi = this.rasi.filter((val) => val !== id);
    }
    this.applyFilters();
  }

  public ngSelectChange() {
    this.applyFilters();
  }

  public applyFilters() {
    const filterPayload = {
      searchText:this.searchText,
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
      minHeight: this.minHeightValue === 0 ? null : this.minHeightValue,
      maxHeight: this.maxHeightValue === 0 ? null : this.maxHeightValue,
      minWeight: this.minWeightValue === 0 ? null : this.minWeightValue,
      maxWeight: this.maxWeightValue === 0 ? null : this.maxWeightValue,
      knownLanguages: this.selectedKnowLanguages,
      religionIds: this.selectedReligion,
      communityIds: this.selectedCommunity,
      jobSectors: this.sector,
      jobTypeIds: this.selectedJobType,
      educationQualificationIds: this.selectedEducation,
      nakshathiram: this.selectedNatshathira,
      raasi: this.selectedRasi,
      salaryFilter: this.selectedCurrency
        ? {
            currencyCode: this.selectedCurrency,
            minMonthlyAmount: this.minSalaryValue,
            maxMonthlyAmount: this.maxSalaryValue,
          }
        : null,
    };
    this.memberService.setFilter(filterPayload);
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.memberService.setFilter(null);
  }

  public clearFilter() {
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
    this.sector = [];
    this.selectedJobType = [];
    this.selectedEducation = [];
    this.natshathira = [];
    this.rasi = [];
    this.selectedCurrency = null;
    this.minSalaryValue = null;
    this.maxSalaryValue = null;

    const emptyPayload = {
      searchText:'',
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

  public searchMembers(searchText:string){
     this.searchValue.next(searchText);
  }

  public getSearchActivities(searchText:string){
    this.searchText = searchText;
    this.applyFilters();
  }
}
