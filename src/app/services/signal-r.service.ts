import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
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
}
