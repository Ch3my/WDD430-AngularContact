import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service'

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  contacts: Contact[] = [];
  // Inicializamos el Servicio usnado Angular
  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    // Llenamos nuestro Array desde el servicio
    // getContacts() clona el objeto, porque?
    this.contactService.contactChangedEvent.subscribe(
      (contact: Contact[]) => {
        this.contacts = contact
      })
    this.contacts = this.contactService.getContacts()
  }

  onSelected(contact: Contact) {
    // Emitimos Evento
    // this.selectedContactEvent.emit(contact)
    this.contactService.contactSelectedEvent.emit(contact);
  }
}
