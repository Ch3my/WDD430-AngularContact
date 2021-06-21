import { EventEmitter, Injectable } from '@angular/core';
// import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Message } from './message.model'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = []
  // messageSelectedEvent = new EventEmitter<Message>()
  // messageChangedEvent = new EventEmitter<Message[]>()
  messageListChangedEvent = new Subject<Message[]>();
  maxMessageid: number

  constructor(private http: HttpClient) { }

  getMaxId(): number {
    let maxId = 0
    for (let d of this.messages) {
      let currentId = parseInt(d.id)
      if (currentId > maxId) {
        maxId = currentId
      }
    }
    return maxId
  }

  getMessages() {
    this.http.get<Message[]>('http://localhost:3000/messages').subscribe(
      (messages: Message[]) => {
        this.messages = messages
        this.maxMessageid = this.getMaxId()

        this.messageListChangedEvent.next(this.messages.slice());
      }, (error: any) => {
        console.log(error);
      })
  }

  getMessage(id: string): Message {
    return this.messages.find(o => o.id == id)
  }

  addMessage(message: Message) {
    // this.messages.push(message)
    // this.messageChangedEvent.emit(this.messages.slice())
    // this.storeMessages()

    this.http.post('http://localhost:3000/messages/', message)
      .subscribe(
        (response: { message: string, newMessage: Message, senderId: string }) => {
          var messageForView = new Message(
            response.newMessage.id,
            message.subject,
            message.msgText,
            { id: response.senderId }
          )
          
          console.log(messageForView)

          this.messages.push(messageForView)
          this.messageListChangedEvent.next(this.messages.slice());
        });

  }

  storeMessages() {
    let messages = JSON.stringify(this.messages)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    this.http.put('http://localhost:3000/messages', messages, { headers: headers })
      .subscribe(() => {
        this.messageListChangedEvent.next(this.messages.slice());
      })
  }

}
