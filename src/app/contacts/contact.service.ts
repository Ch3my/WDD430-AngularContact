import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
// import { MOCKCONTACTS } from './MOCKCONTACTS'
import { Subject } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = []
  maxContactId: number

  contactSelectedEvent = new EventEmitter<Contact>()
  contactChangedEvent = new EventEmitter<Contact[]>()

  contactListChangedEvent = new Subject<Contact[]>()

  constructor(private http: HttpClient) { }

  getContacts() {
    this.http.get<Contact[]>('https://wdd430-4fd0c-default-rtdb.firebaseio.com/contacts.json').subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts
        this.maxContactId = this.getMaxId()
        // sort 
        this.contacts.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
          if (b.name > a.name) {
            return -1;
          }
          return 0;
        })
        // emit the next document list change event
        this.contactListChangedEvent.next(this.contacts.slice());
      }, (error: any) => {
        console.log(error);
      })
  }

  getContact(id: string) {
    return this.contacts.find(o => o.id == id)
    // return this.http.get<{ message: string, contact: Contact }>('https://wdd430-4fd0c-default-rtdb.firebaseio.com/contacts.json?id=' + id)
  }

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
    this.maxContactId++
    newContact.id = this.maxContactId.toString()
    this.contacts.push(newContact)
    // let contactsListClone = this.contacts.slice()
    // this.contactListChangedEvent.next(contactsListClone)
    this.storeContacts()
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
    // let contactsListClone = this.contacts.slice()
    // this.contactListChangedEvent.next(contactsListClone)
    this.storeContacts()
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
    // let contactsListClone = this.contacts.slice()
    // this.contactListChangedEvent.next(contactsListClone)
    this.storeContacts()
  }

  storeContacts() {
    let contacts = JSON.stringify(this.contacts)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    this.http.put('https://wdd430-4fd0c-default-rtdb.firebaseio.com/contacts.json', contacts, { headers: headers })
      .subscribe(() => {
        this.contactListChangedEvent.next(this.contacts.slice());
      })
  }

}
