import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message(
      1,
      'Hi There',
      'My coworkers and I were just talking about the rise of in-cylinder computational fluid dynamics. How do you think it’ll impact auto OEMs? I’ve heard a couple different opinions',
      'Brother Ovard'),
    new Message(2, 'Hi There', 'Unfortunately, I wasn’t able to catch the latest update. Which view are you leaning toward?', 'Brother Camargo'),
    new Message(3, 'Hi There', 'I think we’ll see them be even more stringent toward the regulations ', 'Brother Ovard')]
  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message) {
    this.messages.push(message)
  }

}
