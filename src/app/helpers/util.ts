export enum userType {
  ADMIN = 'Admin',
  AGENT = 'Agent',
  MEMBER = 'member'
}

export const clientData = {
  ADMIN: {
    name: 'admin',
    secretKey: 'admin123',
  },
  AGENT: {
    name: 'Agent',
    secretKey: 'Agent123',
  },

  MEMBER: {
    name:'member',
    secretKey:'member123'
  }
}


export const matrimonyConfig = {
  userType: userType.ADMIN,
  clientData: clientData.ADMIN
}

export const matrimonyAgentConfig = {
  userType: userType.AGENT,
  clientData: clientData.AGENT
}

export const matrimonyMemberConfig = {
  userType: userType.MEMBER,
  clientData: clientData.MEMBER
}
