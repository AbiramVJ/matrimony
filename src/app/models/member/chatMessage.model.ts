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
    this.sentAt = obj?.sentAt ?? '';
    this.isRead = obj?.isRead ?? false;
    this.readAt = obj?.readAt ?? null;
    this.isMine = obj?.isMine ?? false;
  }
}
