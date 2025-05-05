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
