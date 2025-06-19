import { ChatService } from './../../../../../services/chat.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FORM_MODULES } from '../../../../../common/common-imports';

@Component({
  selector: 'app-chat',
  imports: [FORM_MODULES,CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;


  receiverId: string = '';
  messageCheck: string = '';
  messagesCheck: { sender: string, content: string }[] = [];

  constructor(private _chatService:ChatService){
      this._chatService.startConnection();

  }

  ngOnInit() {
    this._chatService.onMessageReceived((message: any) => {
    this.messagesCheck.push({ sender: message.senderName || message.senderId, content: message.textContent });
    this.scrollToBottom();
  });
  }




  private scrollToBottom(): void {
    setTimeout(() => {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    }, 0);
  }


  sendMessages(): void {
    if (this.receiverId && this.messageCheck) {
      this._chatService.sendMessage(this.receiverId, this.messageCheck);
      this.messagesCheck.push({ sender: 'You', content: this.messageCheck });
      this.messageCheck = '';
    }
  }

  check(){
    this._chatService.onMessageReceived((message: any) => {
      console.log(message)
    this.messagesCheck.push({ sender: message.senderName || message.senderId, content: message.textContent });
    this.scrollToBottom();
  });
  }

}
