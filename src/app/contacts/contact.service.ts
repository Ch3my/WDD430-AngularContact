import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = []
  maxDocumentId: number

  contactSelectedEvent = new EventEmitter<Contact>()
  contactChangedEvent = new EventEmitter<Contact[]>()

  contactListChangedEvent = new Subject<Contact[]>()

  constructor() {
    this.contacts = MOCKCONTACTS
  }

  getContacts(): Contact[] {
    return this.contacts.slice()
  }

  getContact(id: string): Contact {
    return this.contacts.find(o => o.id == id)
  }

  // OLD no Subject
  // deleteContact(contact: Contact) { 
  //   if (!contact) {
  //     return;
  //  }
  //  const pos = this.contacts.indexOf(contact);
  //  if (pos < 0) {
  //     return;
  //  }
  //  this.contacts.splice(pos, 1);
  //  this.contactChangedEvent.emit(this.contacts.slice());
  // }

  getMaxId(): number {
    let maxId = 0
    for (let d of this.contacts) {
      let currentId = parseInt(d.id)
      if (currentId > maxId) {
        maxId = currentId
      }
    }
    return maxId
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return
    }
    this.maxDocumentId++
    newContact.id = this.maxDocumentId.toString()
    this.contacts.push(newContact)
    let contactsListClone = this.contacts.slice()
    this.contactListChangedEvent.next(contactsListClone)
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return
    }
    let pos = this.contacts.indexOf(originalContact)
    if (pos < 0) {
      return
    }
    newContact.id = originalContact.id
    this.contacts[pos] = newContact
    let contactsListClone = this.contacts.slice()
    this.contactListChangedEvent.next(contactsListClone)
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return
    }
    let pos = this.contacts.indexOf(contact)
    if (pos < 0) {
      return
    }
    this.contacts.splice(pos, 1)
    let contactsListClone = this.contacts.slice()
    this.contactListChangedEvent.next(contactsListClone)
  }

}
