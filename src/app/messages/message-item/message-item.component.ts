import { Component, Input, OnInit } from '@angular/core';
// import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
import { Message } from '../message.model';
import { Contact } from '../../contacts/contact.model';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message
  messageSender: string

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    // console.log(this.message)
    // load contacts on memory first
    this.contactService.contactListChangedEvent.subscribe(
      (contact: Contact[]) => {
        // console.log(this.message.sender)
        // this.messageSender = this.contactService.getContact(this.message.sender).name
         this.contactService.getContact(this.message.sender.id).subscribe(contactData => {
          this.messageSender = contactData.name;
        })
      })
    this.contactService.getContacts()
  }

}
