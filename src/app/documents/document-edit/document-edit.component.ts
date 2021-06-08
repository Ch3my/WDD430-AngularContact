import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document
  document: Document 
  editMode: boolean = false

  constructor(private documentService: DocumentService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        //get id from parameters
        const id = params['id'];

        //if id doesnt exist on parameters..
        if (!id) {
          //set edit mode to false and exit..
          this.editMode = false;
          return;
        }
        //if it exists on params..
        //get and store the doc with that id in original document prop
        this.originalDocument = this.documentService.getDocument(id);

        //if not document is found with that id...
        if (!this.originalDocument) {
          //exit function
          return;
        }

        this.editMode = true;
        // Clone original Doc
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
      })
  }

  onCancel() {
    this.router.navigate(['/documents'], { relativeTo: this.route });
  }

  onSubmit(form: NgForm) {
    // Read the form
    const value = form.value
    const newDocument = new Document(this.originalDocument?.id, value.name, value.description, value.url, this.originalDocument?.children)

    // Edit if edit or new by default
    if (this.editMode == true) {
      this.documentService.updateDocument(this.originalDocument, newDocument)
    } else {
      this.documentService.addDocument(newDocument);
    }
    this.router.navigate(['/documents'], { relativeTo: this.route });
  }
}
