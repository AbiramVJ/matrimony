import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection!: signalR.HubConnection;
  constructor() { }

   public startConnection(): void {
    let profileId = localStorage.getItem('currentMemberId');
    this.hubConnection = new signalR.HubConnectionBuilder()
       .withUrl(`https://mgate.runasp.net/chathub?profileId=${profileId}`, {
       transport: signalR.HttpTransportType.WebSockets |
             signalR.HttpTransportType.ServerSentEvents |
             signalR.HttpTransportType.LongPolling,
        accessTokenFactory: () => {
          return localStorage.getItem('token')!;
        },
        withCredentials: false,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

   public sendMessage(user: string, message: string): void {
    console.log(user,message )
    this.hubConnection.invoke('SendMessage', 'e9987992-cc7c-4664-8379-be0703dab0a3', message, null, null, null)
      .catch(err => console.error(err));
  }

  public onMessageReceived(callback: (user: string, message: string) => void): void {
    console.log("asdgasg")
    this.hubConnection.on('ReceiveMessage', callback);
  }
}
