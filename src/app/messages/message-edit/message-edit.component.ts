import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  currentSender = 'Jose M. Concha'
  // Leemos elementos de HTML
  @ViewChild('subject', { static: true }) subject: ElementRef
  @ViewChild('msgText', { static: true }) msgText: ElementRef

  @Output() addMessageEvent = new EventEmitter<Message>()

  constructor() { }

  ngOnInit(): void {
  }
  onSendMessage() {
    var msg = new Message(1, this.subject.nativeElement.value, this.msgText.nativeElement.value, this.currentSender)
    this.addMessageEvent.emit(msg)
  }
  onClear() {
    this.subject.nativeElement.value = ''
    this.msgText.nativeElement.value = ''
  }
}
