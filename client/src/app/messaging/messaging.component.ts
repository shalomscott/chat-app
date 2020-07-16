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
  readonly typingMessage$: Observable<string>;
  messageForm: FormGroup;
  private typingTimeout: number | null;

  constructor(
    public messagesService: MessagesService,
    formBuilder: FormBuilder
  ) {
    this.typingTimeout = null;
    this.messageForm = formBuilder.group({
      text: '',
    });
    this.typingMessage$ = new Observable((observer) => {
      this.messagesService.typingUsers$.subscribe((users) => {
        if (users.length > 0) {
          const typingMessage = users.join(',');
          observer.next(
            typingMessage.concat(
              users.length === 1 ? ' is typing...' : ' are typing...'
            )
          );
        } else {
          observer.next('');
        }
      });
    });
  }

  ngOnInit(): void {}

  onTyping(): void {
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

  onSend(): void {
    this.messagesService.sendMessage(this.messageForm.value.text);
    this.messageForm.reset();
  }
}
