import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../messages.service';

@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.css'],
})
export class MessageBubbleComponent implements OnInit {
  @Input() message: Message;
  @Input() isYou: boolean;

  constructor() {
    this.message = {
      id: '',
      timestamp: 0,
      username: '',
      text: '',
      acked: false,
    };
    this.isYou = false;
  }

  ngOnInit(): void {}
}
