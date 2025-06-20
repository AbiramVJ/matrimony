import { ChatService } from './../../../../../services/chat.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FORM_MODULES } from '../../../../../common/common-imports';
import { MemberService } from '../../../../../services/member.service';

@Component({
  selector: 'app-chat',
  imports: [FORM_MODULES,CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
previewImage: string | null = null;
  public searchTerm: string = '';
  public isUploading:boolean = false;
  public searchControl = new FormControl('');

  members: any[] = [
    {
      id: 1,
      name: 'John Smith',
      status: 'online',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=random',
      lastSeen: 'now'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      status: 'online',
      role: 'moderator',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random',
      lastSeen: 'now'
    },
    {
      id: 3,
      name: 'Mike Davis',
      status: 'online',
      role: 'member',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Davis&background=random',
      lastSeen: 'now'
    },
    {
      id: 4,
      name: 'Emily Wilson',
      status: 'away',
      role: 'member',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Wilson&background=random',
      lastSeen: '5 min ago'
    },
    {
      id: 5,
      name: 'Alex Brown',
      status: 'offline',
      role: 'member',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Brown&background=random',
      lastSeen: '2 hours ago'
    },
    {
      id: 6,
      name: 'Lisa Chen',
      status: 'online',
      role: 'member',
      avatar: 'https://ui-avatars.com/api/?name=Lisa+Chen&background=random',
      lastSeen: 'now'
    },
    {
      id: 7,
      name: 'David Kim',
      status: 'busy',
      role: 'member',
      avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=random',
      lastSeen: '1 min ago'
    },
    {
      id: 8,
      name: 'Anna Rodriguez',
      status: 'offline',
      role: 'member',
      avatar: 'https://ui-avatars.com/api/?name=Anna+Rodriguez&background=random',
      lastSeen: 'yesterday'
    }
  ];

  public newMessage: string = '';
  public selectedFile: any | null = null;
  public receiverId: string = '';
  public messagesCheck: { sender: string, content: string, isMine:boolean,type:number  }[] = [];

  constructor(
    private _chatService:ChatService,
    private _memberService:MemberService
  ){
    this._chatService.startConnection();
  }

  ngOnInit() {
    this._chatService.onMessageReceived((message: any) => {
    console.log(message);
    this.messagesCheck.push({ sender: message.senderName || message.senderId, content: message.textContent, isMine:false, type: message.fileType });
    this.scrollToBottom();
  });
  }

  sendMessage() {
    if (this.selectedFile) {
      this._chatService.sendMessage(this.receiverId, this.selectedFile,1);
      this.messagesCheck.push({ sender: 'You', content: this.selectedFile, isMine:true,  type:1});
      this.selectedFile = '';
    } else if (this.newMessage.trim()) {
      this._chatService.sendMessage(this.receiverId, this.newMessage, 2);
      this.messagesCheck.push({ sender: 'You', content: this.newMessage, isMine:true,  type:2 });
      this.newMessage = '';
    }
    this.newMessage = '';
    this.scrollToBottom();
  }

  onFileSelected(event: Event): void {
    this.isUploading = false;
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this._memberService.uploadImageToBulb(formData).subscribe({
      next: (res) => {
       this.selectedFile = res.Result;
       this.previewImage = res.Result;
      },
      complete:() => {
        this.isUploading = false;
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.isUploading = false;
      }
    });
    input.value = '';
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    }, 0);
  }

  clearImagePreview() {
  this.previewImage = null;
  this.selectedFile = null;
}

}


