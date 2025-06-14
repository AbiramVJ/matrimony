import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, from } from 'rxjs';
import { FORM_MODULES } from '../../../../common/common-imports';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [FORM_MODULES,CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  public searchTerm: string = '';
  searchControl = new FormControl('');


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

newMessage: string = '';
  selectedFile: File | null = null;

  messages = [
    // Example messages
    { content: 'Hello!', type: 'text', isMine: false },
    { content: 'Hi there!', type: 'text', isMine: true }
  ];
  ngOnInit() {

  }

sendMessage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.messages.push({ content: reader.result as string, type: 'image', isMine: true });
        this.selectedFile = null;
      };
      reader.readAsDataURL(this.selectedFile);
    } else if (this.newMessage.trim()) {
      this.messages.push({ content: this.newMessage, type: 'text', isMine: true });
    }

    this.newMessage = '';
    this.scrollToBottom();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];
    }
  }
  private scrollToBottom(): void {
    setTimeout(() => {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    }, 0);
  }

}
