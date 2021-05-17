import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  // ID que corresponde a un registro en MOCKCONTACTS
  currentSender = '1'
  // Leemos elementos de HTML
  @ViewChild('subject', { static: true }) subject: ElementRef
  @ViewChild('msgText', { static: true }) msgText: ElementRef

  @Output() addMessageEvent = new EventEmitter<Message>()

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }
  onSendMessage() {
    var msg = new Message('1', this.subject.nativeElement.value, this.msgText.nativeElement.value, this.currentSender)
    this.messageService.addMessage(msg)
  }
  onClear() {
    this.subject.nativeElement.value = ''
    this.msgText.nativeElement.value = ''
  }
}
