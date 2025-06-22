import { ChatService } from './../../../../../services/chat.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FORM_MODULES } from '../../../../../common/common-imports';
import { MemberService } from '../../../../../services/member.service';
import { ChatMessage, ChatParticipant } from '../../../../../models/index.model';
import { FileType } from '../../../../../helpers/enum';
import { LoadingComponent } from "../../../../../common/loading/loading.component";

@Component({
  selector: 'app-chat',
  imports: [FORM_MODULES, CommonModule, LoadingComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  public previewImage: string [] = [];
  public searchTerm: string = '';
  public selectedReceiverId: string | null = null;
  public selectedParticipant!:ChatParticipant;
  public isUploading:boolean = false;
  public isLoading:boolean = false;

  public isGetParticipant:boolean = false;
  public searchControl = new FormControl('');
  public file_type = FileType;

  public participants: ChatParticipant[] = [];
  public isLoadingPar:boolean = true;


  public newMessage: string = '';
  public selectedFile: any | null = null;
  public messagesCheck:ChatMessage[] = [];

  public isTyping = false;
  public typingTimeout: any;
  public typingMembers = new Set<string>();

  constructor(
    private _chatService:ChatService,
    private _memberService:MemberService
  ){
    this._chatService.startConnection();
  }

  ngOnInit() {
      this._chatService.onMessageReceived((message: any) => {
      this.messagesCheck.push(message);
      this.scrollToBottom();
    });

    this._chatService.onChatParticipantsReceived((data: any[]) => {
      this.participants = data;
      if(!this.isGetParticipant && data.length > 0){
        this.getPrivateMessage(data[0]);
      }
      this.isGetParticipant = true;
    });

    //typing
    this._chatService.onTypingStarted((fromProfileId: string) => {
      this.typingMembers.add(fromProfileId);
    });

    this._chatService.onTypingStopped((fromProfileId: string) => {
      this.typingMembers.delete(fromProfileId);
    });

  }

  public check(){
     this._chatService.onChatParticipantsReceived((data: any[]) => {
      this.participants = data;
      console.log('Received participants:', data);
    });
  }

  public sendMessage() {
    let fileType: number;
    let textContent: any = null;
    let fileUrls: string[] = this.previewImage;
    if (this.selectedFile) {
      fileType = FileType.Image;
      this.previewImage = [];
      this.selectedFile = '';
    } else if (this.newMessage.trim()) {
      textContent = this.newMessage.trim();
      fileType = FileType.Text;
      this.newMessage = '';
    } else {
      return;
    }

    this._chatService.sendMessage(this.selectedParticipant.receiverProfileId, textContent, fileUrls, fileType);
    const sentMessage = new ChatMessage({
      id: null,
      senderProfileId: 'You',
      receiverProfileId: this.selectedParticipant.receiverProfileId,
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
       this.previewImage.push(res.Result);
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
    this.previewImage = [];
    this.selectedFile = null;
  }


  //TYPING
  public onTyping(): void {
    console.log("hi")
  if (!this.selectedParticipant) return;
    if (!this.isTyping) {
      this._chatService.sendTypingStarted(this.selectedParticipant.receiverProfileId);
      this.isTyping = true;
    }

    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.stopTyping();
    }, 2000);
  }

  public stopTyping(): void {
    if (this.isTyping && this.selectedParticipant) {
      this._chatService.sendTypingStopped(this.selectedParticipant.receiverProfileId);
      this.isTyping = false;
    }
  }

  public getPrivateMessage(receiver:ChatParticipant){
    this.selectedParticipant = receiver;
    this.isLoading = true;
    this._chatService.getPrivateMessages(receiver.receiverProfileId,1,25).subscribe({
      next:(res:any) => {
        this.messagesCheck = res;
        this.isLoadingPar = false;
      },
      complete:()=>{
        this.isLoading = false;
         this.scrollToBottom();
      },error:(error:any)=>{
        this.isLoading = false;
         this.isLoadingPar = false;
      }
    })
  }

}


