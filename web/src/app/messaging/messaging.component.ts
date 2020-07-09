import { Component, OnInit } from '@angular/core';
import { Message, MessagesService } from '../messages.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css'],
})
export class MessagingComponent implements OnInit {
  messageForm: FormGroup;
  messages: Message[];
  typingUsers: string[];
  private typingTimeout: number = null;

  constructor(
    private messagesService: MessagesService,
    formBuilder: FormBuilder
  ) {
    this.messageForm = formBuilder.group({
      text: '',
    });
  }

  ngOnInit(): void {
    this.messages = this.messagesService.getMessages();
    this.typingUsers = this.messagesService.getTypingUsers();
  }

  typing() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    } else {
      this.messagesService.startTyping();
    }
    this.typingTimeout = setTimeout(() => {
      this.messagesService.stopTyping();
      this.typingTimeout = null;
    }, 500);
  }

  formatTypingMessage() {
    if (this.typingUsers.length > 0) {
      const typingMessage = this.typingUsers.join(',');
      return typingMessage.concat(
        this.typingUsers.length === 1 ? ' is typing...' : ' are typing...'
      );
    }
  }

  send() {
    this.messagesService.sendMessage(this.messageForm.value.text);
    this.messageForm.reset();
  }
}
