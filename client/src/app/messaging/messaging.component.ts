import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../messages.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css'],
})
export class MessagingComponent implements OnInit {
  messageForm: FormGroup;
  private typingTimeout: number = null;

  constructor(
    public messagesService: MessagesService,
    formBuilder: FormBuilder
  ) {
    this.messageForm = formBuilder.group({
      text: '',
    });
  }

  ngOnInit(): void {}

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

  public readonly typingMessage: Observable<string> = new Observable(
    (observer) => {
      this.messagesService.typingUsers.subscribe((typingUsers) => {
        if (typingUsers.length > 0) {
          const typingMessage = typingUsers.join(',');
          observer.next(
            typingMessage.concat(
              typingUsers.length === 1 ? ' is typing...' : ' are typing...'
            )
          );
        } else {
          observer.next('');
        }
      });
    }
  );

  send() {
    this.messagesService.sendMessage(this.messageForm.value.text);
    this.messageForm.reset();
  }
}
