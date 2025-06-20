import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../environments/environment';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChatMessage } from '../models/index.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection!: signalR.HubConnection;
  private baseUrl = (environment as any).baseUrl;
  constructor(private http: HttpClient) { }

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

   public sendMessage(user: string, textContent: string, fileUrls:string[], fileType:any ): void {
    this.hubConnection.invoke('SendMessage', user, textContent, fileUrls,fileType)
      .catch(err => console.error(err));
  }

    public onMessageReceived(callback: (message: ChatMessage) => void): void {
    this.hubConnection.on('ReceiveMessage', (data: any) => {
      const message = new ChatMessage(data);
      callback(message);
    });
  }

  //HTTP CALLS
  public getPrivateMessages(withProfileId:string, pageNumber:number, pageSize:number){
    let profileId = localStorage.getItem('currentMemberId');
    return this.http.get(this.baseUrl + `Chat/history?profileId=${profileId}&withProfileId=${withProfileId}&pageNumber=${pageNumber}&pageSize=${pageSize}`).pipe(
        map((res: any) => {
        return res.Result.data.map((data:any) => new ChatMessage(data));
      })
    );
  }



}
