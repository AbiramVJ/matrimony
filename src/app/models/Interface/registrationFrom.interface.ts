export interface UserBasicForm {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  height: number;
  weight: number;
}

export interface UserContactForm {
  email: string;
  phoneNumber: string;
  city: string;
  stateProvince: string;
  convenientTimeToCall: string;
  country: string;
  address: string;
  residencyStatus: number;
  addressType: 'permanent' | 'temporary' | string;
}

export interface PersonalDetails {
  aboutMe: string;
  disability: string;
  motherTongue: number;
  diet: number;
  smoking: number;
  drinking: number;
  languages: any;
  bodyType:number,
  canReLocated: boolean;
}
export interface UserFamilyInfo {
  fatherName: string;
  motherName: string;
  fatherOccupation: string;
  matherOccupation: string;
  siblings: number;
  familyType: number;
}

export interface UserReligiousInfo {
  religion: number;
  communityCast: number;
  timeOfBirth: string;

  subCast: number;
  starNakshathra: number;
  raasi: number;
  chevvaiDosham: number;
  horoscopeMatching: number;
  city: string;
  stateProvince: string;
  country: string;
}

export interface UserEducationDetails{
  highestEducation: number;
  qualification: string;
  institute: string;
  jobTitle: string;
  companyName: string;
  sector: number;
  jobType: number;
  salaryDetails: string;
  currency: number;
  isYearly: number;
}

export interface MatchPreferences {
  profileFor: number;
  gender: number;
  minAge: number;
  maxAge: number;
  country: string;
}


