export enum ResetPasswordStep {
  login = 0,
  enterEmail = 1,
  verification = 2,
  resetPassword = 3
}

export enum LoginType
{
  Email = 1,
  PhoneNumber = 2,
  Google = 3,
  Facebook = 4
}

export enum TokenType
{
    ClientToken = 1,
    LoginToken = 2,
    ForgotPasswordToken = 3,
    ResetPasswordToken = 4,
    UserVerificationToken = 5,
}

export enum MemberRegistrationStep {
  basic = 1,
  contact = 2,
  personal = 3,
  family = 4,
  religionBackground = 5,
  education = 6,
  complete = 7
}


