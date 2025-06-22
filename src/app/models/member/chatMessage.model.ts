export class ChatMessage {
  id: string | null;
  senderProfileId: string | null;
  receiverProfileId: string;
  textContent: string | null;
  fileUrls: string[];
  fileType: number;
  sentAt: string | null;
  isRead: boolean | null;
  readAt: string | null;
  isMine: boolean;

  constructor(obj: any) {
    this.id = obj?.id ?? '';
    this.senderProfileId = obj?.senderProfileId ?? '';
    this.receiverProfileId = obj?.receiverProfileId ?? '';
    this.textContent = obj?.textContent ?? null;
    this.fileUrls = obj?.fileUrls ?? [];
    this.fileType = obj?.fileType ?? 2;
    this.sentAt = getFormattedLastSentAt(obj?.sentAt) ?? '';
    this.isRead = obj?.isRead ?? false;
    this.readAt = obj?.readAt ?? null;
    this.isMine = obj?.isMine ?? false;
  }
}

export class ChatParticipant {
  receiverProfileId: string;
  name: string;
  profileImage: string | null;
  lastSentAt: string;
  isRead: boolean;

  constructor(obj: any) {
    this.receiverProfileId = obj?.receiverProfileId ?? '';
    this.name = obj?.name ?? '';
    this.profileImage = obj?.profileImage ?? null;
    this.lastSentAt = getFormattedLastSentAt(obj?.lastSentAt) ?? '';
    this.isRead = obj?.isRead ?? false;
  }
}
export function getFormattedLastSentAt(lastSentAt:any): string {
    if (!lastSentAt) return '';

    const sentDate = new Date(lastSentAt);
    const now = new Date();

    const isToday =
      sentDate.toDateString() === now.toDateString();

    const isThisYear =
      sentDate.getFullYear() === now.getFullYear();

    if (isToday) {
      return sentDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }

    if (isThisYear) {
      return sentDate.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short'
      });
    }

    return sentDate.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
  }
