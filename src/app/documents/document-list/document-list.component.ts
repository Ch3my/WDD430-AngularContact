import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>()

  documents: Document[] = [{
    id: 1,
    name: 'The lord of the Rings',
    description: 'My favorite things about the lord of the rings',
    url: 'https://www.reddit.com/r/lotrmemes/comments/itgyys/my_favorite_things_lotr_edition/',
    children: []
  }, {
    id: 2,
    name: 'Top Secret Document',
    description: 'Confidential',
    url: 'https://www.wrc.noaa.gov/wrso/security_guide/mailing.htm#:~:text=TOP%20SECRET%20material%20may%20not,United%20States%20and%20its%20territories.',
    children: []
  }, {
    id: 3,
    name: 'Places I want to go',
    description: 'When COVID is not around',
    url: 'https://www.google.com/maps/d/u/0/embed?mid=1aarvE8dun_izTNmEtXLXCZAfoKs&hl=en&ie=UTF8&msa=0&ll=35.51434278495349%2C-115.279541&spn=26.2815%2C85.187988&output=embed&z=4',
    children: []
  }, {
    id: 4,
    name: 'Things I want to eat',
    description: 'Foods I want to try',
    url: 'https://www.gq.com/gallery/the-50-best-things-to-eat-and-drink-right-now',
    children: []
  }]
  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document)
  }
}
