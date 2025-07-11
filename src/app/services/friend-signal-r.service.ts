import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FriendSignalRService {
  private hubConnection!: signalR.HubConnection;
  private friendRequestReceivedSource = new Subject<any>();
  friendRequestReceived$ = this.friendRequestReceivedSource.asObservable();

  constructor(private http: HttpClient) {}

  public startConnection(): void {
    let profileId = localStorage.getItem('currentMemberId');
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        `https://mgate.runasp.net/hubs/friend-request?profileId=${profileId}`,
        {
          transport:
            signalR.HttpTransportType.WebSockets |
            signalR.HttpTransportType.ServerSentEvents |
            signalR.HttpTransportType.LongPolling,
          accessTokenFactory: () => {
            return localStorage.getItem('token')!;
          },
          withCredentials: false,
        }
      )
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        //  this.getChatParticipants()
      })
      .catch((err) => console.log('Error while starting connection: ' + err));
  }

  public registerFriendRequestListener(callback: (data: any) => void): void {
    this.hubConnection.on('FriendRequestReceived', (data) => {
      console.log('Friend request received: ', data);
      callback(data); // use the passed-in callback
    });
  }


}
