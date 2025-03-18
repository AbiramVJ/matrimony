export enum userType {
  ADMIN = 'Admin',
  AGENT = 'Agent',
  user = 'user'
}

export const clientData = {
  ADMIN: {
    name: 'admin',
    secretKey: 'admin123',
  },
  AGENT: {
    name: 'Agent',
    secretKey: 'Agent123',
  }
}

export const matrimonyConfig = {
  userType: userType.ADMIN,
  clientData: clientData.ADMIN
}
