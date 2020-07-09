import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../messages.service';

@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.css'],
})
export class MessageBubbleComponent implements OnInit {
  @Input() message: Message = null;
  @Input() isYou: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
