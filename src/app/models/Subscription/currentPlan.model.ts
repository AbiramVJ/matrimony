export class MemberCurrentPlan {
  planId:string;
  subscriptionIdString:string;
  planName: string;
  price: number;
  intervalType: number;
  interval: number;
  last4Digit: string | null;
  cardType: string | null;
  isRequestToCancel: boolean;
  currentPeriodEnd: Date | null;
  downgradeSubscriptionDate: Date | null;
  canChangeSubscription: boolean;
  remainingMemberCount: number;
  remainingFriendRequestCount: number;

  constructor(data: any) {
    this.planId = data.planId ?? '';
    this.subscriptionIdString = data.subscriptionIdString ?? '';
    this.planName = data.planName ?? '';
    this.price = data.price ?? 0;
    this.intervalType = data.intervalType ?? 0;
    this.interval = data.interval ?? 0;
    this.last4Digit = data.last4Digit ?? null;
    this.cardType = data.cardType ?? null;
    this.isRequestToCancel = data.isRequestToCancel ?? false;
    this.currentPeriodEnd = data.currentPeriodEnd ? new Date(data.currentPeriodEnd) : null;
    this.downgradeSubscriptionDate = data.downgradeSubscriptionDate ? new Date(data.downgradeSubscriptionDate) : null;
    this.canChangeSubscription = data.canChangeSubscription ?? false;
    this.remainingMemberCount = data.remainingMemberCount ?? 0;
    this.remainingFriendRequestCount = data.remainingFriendRequestCount ?? 0;
  }
}
