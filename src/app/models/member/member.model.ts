export class ProfileSalary {
  isAnnual: boolean;
  amount: number;
  currencyCode: string;
  isVisible: boolean;

  constructor(obj: any = {}) {
    this.isAnnual = obj?.isAnnual ?? false;
    this.amount = obj?.amount ?? 0;
    this.currencyCode = obj?.currencyCode ?? '';
    this.isVisible = obj?.isVisible ?? false;
  }
}

export class ProfileJob {
  id: string;
  title: string;
  companyName: string;
  sector: number;
  jobTypeId: string;
  profileSalary: ProfileSalary;

  constructor(obj: any = {}) {
    this.id = obj?.id ?? '';
    this.title = obj?.title ?? '';
    this.companyName = obj?.companyName ?? '';
    this.sector = obj?.sector ?? 0;
    this.jobTypeId = obj?.jobTypeId ?? '';
    this.profileSalary = new ProfileSalary(obj?.profileSalary);
  }
}

export class ProfileLookingFor {
  id: string;
  gender: number;
  minAge: number;
  maxAge: number;
  country: string;

  constructor(obj: any = {}) {
    this.id = obj?.id ?? '';
    this.gender = obj?.gender ?? 0;
    this.minAge = obj?.minAge ?? 0;
    this.maxAge = obj?.maxAge ?? 0;
    this.country = obj?.country ?? '';
  }
}

export class ProfileFamily {
  id: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  numberOfSiblings: number;
  familyType: number;

  constructor(obj: any = {}) {
    this.id = obj?.id ?? '';
    this.fatherName = obj?.fatherName ?? '';
    this.fatherOccupation = obj?.fatherOccupation ?? '';
    this.motherName = obj?.motherName ?? '';
    this.motherOccupation = obj?.motherOccupation ?? '';
    this.numberOfSiblings = obj?.numberOfSiblings ?? 0;
    this.familyType = obj?.familyType ?? 0;
  }
}

export class ProfileAstrology {
  id: string;
  nakshathiram: number;
  raasi: number;
  timeOfBirth: string;

  constructor(obj: any = {}) {
    this.id = obj?.id ?? '';
    this.nakshathiram = obj?.nakshathiram ?? 0;
    this.raasi = obj?.raasi ?? 0;
    this.timeOfBirth = obj?.timeOfBirth ?? '';
  }
}

export class ProfileImage {
  id?: string;
  url: string;
  isProfile?: boolean;

  constructor(obj: any = {}) {
    this.id = obj?.id;
    this.url = obj?.url ?? '';
    this.isProfile = obj?.isProfile ?? false;
  }
}

export class ProfileAddress {
  id?: string;
  addressType: number;
  residentStatus?: number | null;
  isDefault: boolean;
  number?: string | null;
  street: string;
  city: string;
  state: string;
  zipcode?: string | null;
  country: string;
  latitude: number;
  longitude: number;

  constructor(obj: any = {}) {
    this.id = obj?.id;
    this.addressType = obj?.addressType ?? 0;
    this.residentStatus = obj?.residentStatus;
    this.isDefault = obj?.isDefault ?? false;
    this.number = obj?.number;
    this.street = obj?.street ?? '';
    this.city = obj?.city ?? '';
    this.state = obj?.state ?? '';
    this.zipcode = obj?.zipcode;
    this.country = obj?.country ?? '';
    this.latitude = obj?.latitude ?? 0;
    this.longitude = obj?.longitude ?? 0;
  }
}

export class ProfileEducation {
  id?: string;
  qualification: string;
  institute: string;
  sortNo: number;
  educationQualificationId: string;

  constructor(obj: any = {}) {
    this.id = obj?.id;
    this.qualification = obj?.qualification ?? '';
    this.institute = obj?.institute ?? '';
    this.sortNo = obj?.sortNo ?? 0;
    this.educationQualificationId = obj?.educationQualificationId ?? '';
  }
}

export class UserProfile {
  id: string;
  profileFor: number;
  isActive: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  aboutMe: string;
  gender: number;
  dateOfBirth: string;
  foodHabit: number;
  drinksHabit: number;
  smokeHabit: number;
  marriageStatus: number;
  bodyType: number;
  willingToRelocate: number;
  height: number;
  weight: number;
  disability: string;
  originCountry: string;
  motherTongue: string;
  knownLanguages: string | null;
  bloodGroup: number;
  skinComplexion: string | null;
  isVisibleCommunity: boolean;
  userId: string;
  religionId: string;
  communityId: string;
  subCommunityId: string;
  profileJob: ProfileJob;
  profileLookingFor: ProfileLookingFor;
  profileFamily: ProfileFamily;
  profileAstrology: ProfileAstrology;
  profileImages: ProfileImage[];
  profileAddresses: ProfileAddress[];
  profileEducations: ProfileEducation[];
  phoneCode:string;
  age:number;

  constructor(obj: any = {}) {
    const images = obj?.profileImages ?? [];
    this.id = obj?.id ?? '';
    this.profileFor = obj?.profileFor ?? 0;
    this.isActive = obj?.isActive ?? false;
    this.firstName = obj?.firstName ?? '';
    this.lastName = obj?.lastName ?? '';
    this.email = obj?.email ?? '';
    this.phoneNumber = obj?.phoneNumber ?? '';
    this.aboutMe = obj?.aboutMe ?? '';
    this.gender = obj?.gender ?? 0;
    this.dateOfBirth = obj?.dateOfBirth ?? '';
    this.foodHabit = obj?.foodHabit ?? 0;
    this.drinksHabit = obj?.drinksHabit ?? 0;
    this.smokeHabit = obj?.smokeHabit ?? 0;
    this.marriageStatus = obj?.marriageStatus ?? 0;
    this.bodyType = obj?.bodyType ?? 0;
    this.willingToRelocate = obj?.willingToRelocate ?? 0;
    this.height = obj?.height ?? 0;
    this.weight = obj?.weight ?? 0;
    this.disability = obj?.disability ?? '';
    this.originCountry = obj?.originCountry ?? '';
    this.motherTongue = obj?.motherTongue ?? '';
    this.knownLanguages = obj?.knownLanguages ?? null;
    this.bloodGroup = obj?.bloodGroup ?? 0;
    this.skinComplexion = obj?.skinComplexion ?? null;
    this.isVisibleCommunity = obj?.isVisibleCommunity ?? false;
    this.userId = obj?.userId ?? '';
    this.religionId = obj?.religionId ?? '';
    this.communityId = obj?.communityId ?? '';
    this.subCommunityId = obj?.subCommunityId ?? '';
    this.profileJob = new ProfileJob(obj?.profileJob);
    this.profileLookingFor = new ProfileLookingFor(obj?.profileLookingFor);
    this.profileFamily = new ProfileFamily(obj?.profileFamily);
    this.profileAstrology = new ProfileAstrology(obj?.profileAstrology);
    // this.profileImages = (obj?.profileImages ?? []).map((i: any) => new ProfileImage(i));
    this.profileImages = images.length > 0
  ? images.map((i: any) => new ProfileImage(i))
  : [new ProfileImage({ url: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740' })];
    this.profileAddresses = (obj?.profileAddresses ?? []).map((a: any) => new ProfileAddress(a));
    this.profileEducations = (obj?.profileEducations ?? []).map((e: any) => new ProfileEducation(e));
    this.phoneCode = obj.phoneCode ?? '';
    this.age = obj.age ?? 0;
  }
}
