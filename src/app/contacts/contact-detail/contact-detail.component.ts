import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  // @Input() contact: Contact;
  contact: Contact;

  constructor(private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.contact = this.contactService.getContact(params.id)
        // this.contactService.getContact(params.id)
        //   .subscribe(contactData => {
        //     this.contact = contactData.contact;
        //   })
      }
    )
  }

  deleteContact() {
    this.contactService.deleteContact(this.contact)
    this.router.navigate(['/contacts'], { relativeTo: this.route });

  }

}
