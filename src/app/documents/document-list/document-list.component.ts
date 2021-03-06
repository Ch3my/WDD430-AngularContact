import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = []
  subscription: Subscription
  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.documentService.documentChangedEvent.subscribe(
      (documents: Document[]) => {
        this.documents = documents;
      })
    // No asignamos la variable directo sino a traves de la subscripcion 
    this.documentService.getDocuments()
    // this.documents = this.documentService.getDocuments()

    this.subscription = this.documentService.documentListChangedEvent.subscribe((documentsList: Document[]) => {
      this.documents = documentsList
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
