import { ChatService } from './../../../../../services/chat.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FORM_MODULES } from '../../../../../common/common-imports';
import { MemberService } from '../../../../../services/member.service';
import { ChatMessage } from '../../../../../models/index.model';
import { FileType } from '../../../../../helpers/enum';

@Component({
  selector: 'app-chat',
  imports: [FORM_MODULES,CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  public previewImage: string | null = null;
  public searchTerm: string = '';
  public isUploading:boolean = false;
  public isLoading:boolean = false;
  public searchControl = new FormControl('');
  public file_type = FileType;

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
  public messagesCheck:ChatMessage[] = [];

  constructor(
    private _chatService:ChatService,
    private _memberService:MemberService
  ){
    this._chatService.startConnection();
    this.getPrivateMessage();
  }

  ngOnInit() {
    this._chatService.onMessageReceived((message: any) => {
      console.log(message);
    this.messagesCheck.push(message);
    this.scrollToBottom();
  });
  }

  // public sendMessage() {
  //   let fileType: number;
  //   let textContent: string;
  //   let fileUrls: string[] = [];

  //   if (this.selectedFile) {
  //     fileUrls.push(this.selectedFile)
  //     fileType = FileType.Image;
  //     this.previewImage = null;
  //     this.selectedFile = '';
  //   } else if (this.newMessage.trim()) {
  //     textContent = this.newMessage.trim();
  //     fileType = FileType.Text;
  //     this.newMessage = '';
  //   } else {
  //     return;
  //   }
  //   this._chatService.sendMessage(this.receiverId, textContent, fileUrls, messageType, fileType);
  //     const sentMessage = new ChatMessage({
  //     id: null,
  //     senderProfileId: 'You',
  //     receiverProfileId: this.receiverId,
  //     textContent: content || null,
  //     fileUrl: null,
  //     fileName: null,
  //     fileType: messageType,
  //     sentAt: new Date().toISOString(),
  //     isRead: false,
  //     readAt: null,
  //     isMine: true
  //   });
  //   console.log(sentMessage);
  //   this.messagesCheck.push(sentMessage);
  //   this.scrollToBottom();
  // }
  public sendMessage() {
    let fileType: number;
    let textContent: any;
    let fileUrls: string[] = [];

    if (this.selectedFile) {
      fileUrls.push(this.selectedFile);
      fileType = FileType.Image;
      this.previewImage = null;
      this.selectedFile = '';
    } else if (this.newMessage.trim()) {
      textContent = this.newMessage.trim();
      fileType = FileType.Text;
      this.newMessage = '';
    } else {
      return;
    }

    this._chatService.sendMessage(this.receiverId, textContent, fileUrls, fileType);
    const sentMessage = new ChatMessage({
      id: null,
      senderProfileId: 'You',
      receiverProfileId: this.receiverId,
      textContent: textContent,
      fileUrls: fileUrls,
      fileType: fileType,
      sentAt: new Date().toISOString(),
      isRead: false,
      readAt: null,
      isMine: true
    });

    this.messagesCheck.push(sentMessage);
    this.scrollToBottom();
  }


  public onFileSelected(event: Event): void {
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
    }, 100);
  }

  public clearImagePreview() {
    this.previewImage = null;
    this.selectedFile = null;
  }

  public getPrivateMessage(){
    this.isLoading = true;
    this._chatService.getPrivateMessages('b1386fbc-fff1-49ea-b601-d0092e7996d7',1,25).subscribe({
      next:(res:any) => {
        this.messagesCheck = res;
      },
      complete:()=>{
        this.isLoading = false;
         this.scrollToBottom();
      },error:(error:any)=>{
        this.isLoading = false;
      }
    })
  }

}


