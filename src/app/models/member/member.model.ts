import { BloodGroup, bodyTypes, diet, DrinkHabit, maritalStatusOptions, Natshathira, raasiList, SmokeHabit, willingToRelocate } from "../../helpers/data";

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
  starName:string | null;
  rasiName:string | null;

  constructor(obj: any = {}) {
    this.id = obj?.id ?? '';
    this.nakshathiram = obj?.nakshathiram ?? 0;
    this.raasi = obj?.raasi ?? 0;
    this.timeOfBirth = obj?.timeOfBirth ?? '';
    this.starName = obj?.nakshathiram ? getNatshathira(obj?.nakshathiram) : null;
    this.rasiName = obj?.raasi ? getRasi(obj?.raasi) : null;
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
  communityId: string | null;
  subCommunityId: string | null;
  profileJob: ProfileJob | null;
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
    this.communityId = obj?.communityId ?? null;
    this.subCommunityId = obj?.subCommunityId ?? null;
    this.profileJob = obj?.profileJob ? new ProfileJob(obj?.profileJob) : null;
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
export class MainUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  image: string;

  constructor(obj: any) {
    this.id = obj?.id ?? null;
    this.firstName = obj?.firstName ?? null;
    this.lastName = obj?.lastName ?? null;
    this.email = obj?.email ?? null;
    this.phoneNumber = obj?.phoneNumber ?? null;
    this.image = obj?.image ?? 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png';
  }
}

export class LivingAddress {
  id: string;
  addressType: number;
  residentStatus: number;
  isDefault: boolean;
  number: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  latitude: number;
  longitude: number;

  constructor(obj: any) {
    this.id = obj?.id ?? null;
    this.addressType = obj?.addressType ?? null;
    this.residentStatus = obj?.residentStatus ?? null;
    this.isDefault = obj?.isDefault ?? false;
    this.number = obj?.number ?? '';
    this.street = obj?.street ?? '';
    this.city = obj?.city ?? '';
    this.state = obj?.state ?? '';
    this.zipcode = obj?.zipcode ?? '';
    this.country = obj?.country ?? '';
    this.latitude = obj?.latitude ?? 0;
    this.longitude = obj?.longitude ?? 0;
  }
}

export class MemberProfile {
  id: string;
  firstName: string;
  lastName: string;
  gender: number;
  dateOfBirth: string;
  age: number;
  religion: string;
  jobTitle: string;
  imageUrl: string;
  livingAddresses: LivingAddress | null;

  constructor(obj: any) {
    this.id = obj?.id ?? null;
    this.firstName = obj?.firstName ?? '';
    this.lastName = obj?.lastName ?? '';
    this.gender = obj?.gender ?? null;
    this.dateOfBirth = obj?.dateOfBirth ?? null;
    this.age = obj?.age ?? null;
    this.religion = obj?.religion ?? '';
    this.jobTitle = obj?.jobTitle ?? '';
    this.imageUrl = obj?.imageUrl ?? 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png';
    this.livingAddresses = obj.livingAddresses ? new LivingAddress(obj.livingAddresses) : null;
  }
}


export class FullUserProfile {
  id: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneCode: string;
  aboutMe: string;
  gender: string | null;
  dateOfBirth: string;
  foodHabit: string | null;
  drinksHabit: string | null;
  smokeHabit: string | null;
  marriageStatus: string | null;
  bodyType: string | null;
  willingToRelocate: string | null;
  height: number;
  weight: number;
  disability: string;
  originCountry: string;
  motherTongue: string;
  knownLanguages: string;
  bloodGroup: string | null;
  skinComplexion: number;
  religionId: string;
  communityId: string;
  subCommunityId: string;
  profileJob: ProfileJob | null;
  profileLookingFor: ProfileLookingFor |null;
  profileFamily: ProfileFamily |null;
  profileAstrology: ProfileAstrology |null;
  profileImages: ProfileImage[];
  profileAddresses: ProfileAddress[];
  profileEducations: ProfileEducation[];
  age: number;

  constructor(obj: any) {
    this.id = obj?.id ?? null;
    this.isActive = obj?.isActive ?? false;
    this.firstName = obj?.firstName ?? '';
    this.lastName = obj?.lastName ?? '';
    this.email = obj?.email ?? '';
    this.phoneNumber = obj?.phoneNumber ?? '';
    this.phoneCode = obj?.phoneCode ?? '';
    this.aboutMe = obj?.aboutMe ?? '';
    this.gender = obj?.gender ? (obj?.gender == 1 ? 'Male' : 'Female') : null;
    this.dateOfBirth = obj?.dateOfBirth ?? '';
    this.foodHabit = this.getFoodHabit(obj?.foodHabit) ?? null;
    this.drinksHabit = this.getDrinkingHabit(obj?.drinksHabit) ?? null;
    this.smokeHabit = this.getSmokeHabit( obj?.smokeHabit) ?? null;
    this.marriageStatus = this.getMarriedStatus(obj?.marriageStatus) ?? null;
    this.bodyType = this.getBodyType(obj?.bodyType) ?? null;
    this.willingToRelocate = this.getRelocated(obj?.willingToRelocate) ?? null;
    this.height = obj?.height ?? null;
    this.weight = obj?.weight ?? null;
    this.disability = obj?.disability ?? '';
    this.originCountry = obj?.originCountry ?? '';
    this.motherTongue = obj?.motherTongue ?? '';
    this.knownLanguages = obj?.knownLanguages ?? '';
    this.bloodGroup = this.getBloodGroup(obj?.bloodGroup)  ?? null;
    this.skinComplexion = obj?.skinComplexion ?? null;
    this.religionId = obj?.religionId ?? null;
    this.communityId = obj?.communityId ?? null;
    this.subCommunityId = obj?.subCommunityId ?? null;
    this.profileJob = obj?.profileJob ? new ProfileJob(obj.profileJob) : null;
    this.profileLookingFor = obj?.profileLookingFor ? new ProfileLookingFor(obj.profileLookingFor) : null;
    this.profileFamily = obj?.profileFamily ? new ProfileFamily(obj.profileFamily) : null;
    this.profileAstrology = obj?.profileAstrology ? new ProfileAstrology(obj.profileAstrology) : null;
    this.profileImages = obj?.profileImages?.map((x: any) => new ProfileImage(x)) ?? [];
    this.profileAddresses = obj?.profileAddresses?.map((x: any) => new ProfileAddress(x)) ?? [];
    this.profileEducations = obj?.profileEducations?.map((x: any) => new ProfileEducation(x)) ?? [];
    this.age = obj?.age ?? 0;
  }

  getMarriedStatus(status: number): string {
    const option = maritalStatusOptions.find(opt => opt.id === status);
    return option ? option.name : 'Unknown';
  }

  getFoodHabit(status: number): string{
    const option = diet.find(opt => opt.id === status);
    return option ? option.name : 'Unknown';
  }

  getRelocated(status:number): string{
    const option = willingToRelocate.find(opt => opt.id === status);
    return option ? option.name : 'Unknown';
  }

  getBloodGroup(status:number): string{
    const option = BloodGroup.find(opt => opt.id === status);
    return option ? option.name : 'Unknown';
  }

  getBodyType(status:number): string{
    const option = bodyTypes.find(opt => opt.id === status);
    return option ? option.name : 'Unknown';
  }

  getSmokeHabit(status:number): string{
    const option = SmokeHabit.find(opt => opt.id === status);
    return option ? option.name : 'Unknown';
  }

  getDrinkingHabit(status:number) : string {
    const option = DrinkHabit.find(opt => opt.id === status);
    return option ? option.name : 'Unknown';
  }



}

export function getNatshathira(status:number){
  const option = Natshathira.find(opt => opt.id === status);
  return option ? option.name : 'Unknown';
}

export function getRasi(status:number){
  const option = raasiList.find(opt => opt.id === status);
  return option ? option.name : 'Unknown';
}
