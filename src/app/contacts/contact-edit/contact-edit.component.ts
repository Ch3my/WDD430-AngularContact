import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;
  flagInvalidContact: boolean = false

  constructor(private contactService: ContactService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id'];

        if (!id) {
          this.editMode = false;
          return;
        }

        this.originalContact = this.contactService.getContact(id);

        if (!this.originalContact) {
          return;
        }

        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact));
        if (this.contact.group !== null && this.contact.group !== undefined) {
          this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
        }
      })
  }

  onCancel() {
    this.router.navigate(['/contacts'], { relativeTo: this.route });
  }

  onSubmit(form: NgForm) {
    // Read the form
    const value = form.value
    const newContact = new Contact(null, value.name, value.email, value.phone, value.imageUrl, this.groupContacts)

    // Edit if edit or new by default
    if (this.editMode == true) {
      this.contactService.updateContact(this.originalContact, newContact)
    } else {
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['/contacts'], { relativeTo: this.route });
  }


  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact) {
      return;
    }
    this.groupContacts.push(selectedContact);
  }


  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      return true;
    }

    // Check if editing. Otherwise this.contact is undefined
    // If the contact being draged is the same of the contact we are at
    if (this.editMode) {
      if (newContact.id === this.contact.id) {
        this.flagInvalidContact = true
        setTimeout(() => {
          this.flagInvalidContact = false
        }, 2000)
        return true;
      }
    }

    for (let i = 0; i < this.groupContacts.length; i++) {
      // Check if the contact being dragged already exists
      if (newContact.id === this.groupContacts[i].id) {
        //is INVALID
        this.flagInvalidContact = true
        setTimeout(() => {
          this.flagInvalidContact = false
        }, 2000)
        return true;
      }
    }

    //if passes all tests, we are OK
    return false;
  }
}
