import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

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
  private messages: Message[] = [];
  private typingUsers: string[] = [];

  constructor(private auth: AuthService) {
    this.socket = io(environment.SOCKET_ENDPOINT);

    this.socket.on('incomingMessage', (message: Message) => {
      this.messages.push(message);
      if (!this.isCurrentUser(message)) {
        this.socket.emit('ack', message.id);
      }
    });

    this.socket.on('ack', (messageId) => {
      const ackedMessage = this.messages.find((m) => m.id === messageId);
      if (ackedMessage) ackedMessage.acked = true;
    });

    this.socket.on('start_typing', (username) => {
      if (username !== this.auth.getCurrentUser()) {
        this.typingUsers.push(username);
      }
    });

    this.socket.on('stop_typing', (username) => {
      const index = this.typingUsers.findIndex((t) => t === username);
      if (index > -1) this.typingUsers.splice(index, 1);
    });
  }

  getMessages() {
    return this.messages;
  }

  getTypingUsers() {
    return this.typingUsers;
  }

  sendMessage(text) {
    this.socket.emit('outgoingMessage', {
      username: this.auth.getCurrentUser(),
      text,
    });
  }

  isCurrentUser(message: Message): boolean {
    return message.username === this.auth.getCurrentUser();
  }

  startTyping() {
    this.socket.emit('start_typing', this.auth.getCurrentUser());
  }

  stopTyping() {
    this.socket.emit('stop_typing', this.auth.getCurrentUser());
  }
}
