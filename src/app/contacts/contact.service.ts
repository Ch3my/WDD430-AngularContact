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
    this.http.get<Contact[]>('http://localhost:3000/contacts').subscribe(
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
    // return this.contacts.find(o => o.id == id)
    return this.http.get<Contact>('http://localhost:3000/contacts/' + id)
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
    // this.contacts.push(newContact)
    // let contactsListClone = this.contacts.slice()
    // this.contactListChangedEvent.next(contactsListClone)
    // this.storeContacts()

    this.http.post('http://localhost:3000/contacts/', newContact)
      .subscribe(
        (response: { message: string, contact: Contact }) => {
          this.contacts.push(response.contact)
          this.contactListChangedEvent.next(this.contacts.slice());
        });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return
    }
    // let pos = this.contacts.indexOf(originalContact)
    const pos = this.contacts.findIndex(d => d.id === originalContact.id);
    if (pos < 0) {
      return
    }
    newContact.id = originalContact.id
    this.contacts[pos] = newContact
    // let contactsListClone = this.contacts.slice()
    // this.contactListChangedEvent.next(contactsListClone)
    // this.storeContacts()

    this.http.put('http://localhost:3000/contacts/' + originalContact.id, newContact)
    .subscribe(
      (response: Response) => {
        this.contacts[pos] = newContact;
        // this.contacts.push(response.contact)
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }

  deleteContact(contact: Contact) {
    console.log(contact)
    if (!contact) {
      return
    }
    const pos = this.contacts.findIndex(d => d.id === contact.id);
    console.log(pos)
    if (pos < 0) {
      return
    }
    // this.contacts.splice(pos, 1)
    // let contactsListClone = this.contacts.slice()
    // this.contactListChangedEvent.next(contactsListClone)
    // this.storeContacts()

    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response: Response) => {
          this.contacts.splice(pos, 1);
          this.contactListChangedEvent.next(this.contacts.slice());
          // this.sortAndSend();
          // Update Client?
        });
  }

  storeContacts() {
    let contacts = JSON.stringify(this.contacts)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    this.http.put('http://localhost:3000/contacts', contacts, { headers: headers })
      .subscribe(() => {
        this.contactListChangedEvent.next(this.contacts.slice());
      })
  }

}
