import { EventEmitter, Injectable } from '@angular/core';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Message } from './message.model'

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = []
  messageSelectedEvent = new EventEmitter<Message>()
  messageChangedEvent = new EventEmitter<Message[]>()

  constructor() {
    this.messages = MOCKMESSAGES
  }

  getMessages(): Message[] {
    return this.messages.slice()
  }

  getMessage(id: string): Message {
    return this.messages.find(o => o.id == id)
  }

  addMessage(message: Message) {
    this.messages.push(message)
    this.messageChangedEvent.emit(this.messages.slice())
  }
}
