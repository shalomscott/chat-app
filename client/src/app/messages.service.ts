import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { environment } from '@environments/environment';

export interface Message {
  id: string;
  timestamp: number;
  username: string;
  text: string;
  acked: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private socket: SocketIOClient.Socket;
  private readonly messagesSubject$ = new BehaviorSubject<Message[]>([]);
  private readonly typingUsersSubject$ = new BehaviorSubject<string[]>([]);

  constructor(private auth: AuthService) {
    this.socket = io(environment.SOCKET_ENDPOINT);

    this.socket.on('incomingMessage', (message: Message) => {
      this.messagesSubject$.next([...this.messagesSubject$.value, message]);
      if (!this.isCurrentUser(message)) {
        this.socket.emit('ack', message.id);
      }
    });

    this.socket.on('ack', (messageId: string) => {
      const ackedMessage = this.messagesSubject$.value.find(
        (m) => m.id === messageId
      );
      if (ackedMessage) {
        ackedMessage.acked = true;
        this.messagesSubject$.next([...this.messagesSubject$.value]);
      }
    });

    this.socket.on('start_typing', (username: string) => {
      if (username !== this.auth.getCurrentUser()) {
        this.typingUsersSubject$.next([
          ...this.typingUsersSubject$.value,
          username,
        ]);
      }
    });

    this.socket.on('stop_typing', (username: string) => {
      const currentTypingUsers = [...this.typingUsersSubject$.value];
      const index = currentTypingUsers.findIndex((t) => t === username);
      if (index > -1) {
        currentTypingUsers.splice(index, 1);
        this.typingUsersSubject$.next(currentTypingUsers);
      }
    });
  }

  get messages$(): Observable<Message[]> {
    return this.messagesSubject$.asObservable();
  }

  get typingUsers$(): Observable<string[]> {
    return this.typingUsersSubject$.asObservable();
  }

  sendMessage(text: string): void {
    this.socket.emit('outgoingMessage', {
      username: this.auth.getCurrentUser(),
      text,
    });
  }

  isCurrentUser(message: Message): boolean {
    return message.username === this.auth.getCurrentUser();
  }

  startTyping(): void {
    this.socket.emit('start_typing', this.auth.getCurrentUser());
  }

  stopTyping(): void {
    this.socket.emit('stop_typing', this.auth.getCurrentUser());
  }

  clearMessages(): void {
    this.messagesSubject$.next([]);
  }
}
