import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
// import { MOCKDOCUMENTS } from './MOCKDOCUMENTS'
import { Subject } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = []
  maxDocumentId: number

  documentSelectedEvent = new EventEmitter<Document>()
  documentChangedEvent = new EventEmitter<Document[]>()

  documentListChangedEvent = new Subject<Document[]>()

  constructor(private http: HttpClient) { }

  getDocuments() {
    this.http.get<Document[]>('https://wdd430-4fd0c-default-rtdb.firebaseio.com/documents.json').subscribe(
      // success method
      (documents: Document[]) => {
        this.documents = documents
        this.maxDocumentId = this.getMaxId()
        // sort the list of documents
        this.documents.sort((a, b) => {
          if (a.name > b.name) {
              return 1;
          }
          if (b.name > a.name) {
              return -1;
          }
          return 0;
      })
        // emit the next document list change event
        this.documentListChangedEvent.next(this.documents.slice());
      }, (error: any) => {
        console.log(error);
      })
  }

  getDocument(id: string): Document {
    return this.documents.find(o => o.id == id)
  }

  getMaxId(): number {
    let maxId = 0
    for (let d of this.documents) {
      let currentId = parseInt(d.id)
      if (currentId > maxId) {
        maxId = currentId
      }
    }
    return maxId
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return
    }
    this.maxDocumentId++
    newDocument.id = this.maxDocumentId.toString()
    this.documents.push(newDocument)
    // let documentsListClone = this.documents.slice()
    // this.documentListChangedEvent.next(documentsListClone)
    this.storeDocuments()

  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return
    }
    let pos = this.documents.indexOf(originalDocument)
    if (pos < 0) {
      return
    }
    newDocument.id = originalDocument.id
    this.documents[pos] = newDocument
    // let documentsListClone = this.documents.slice()
    // this.documentListChangedEvent.next(documentsListClone)
    this.storeDocuments()
  }

  deleteDocument(document: Document) {
    if (!document) {
      return
    }
    let pos = this.documents.indexOf(document)
    if (pos < 0) {
      return
    }
    this.documents.splice(pos, 1)
    // let documentsListClone = this.documents.slice()
    // this.documentListChangedEvent.next(documentsListClone)
    this.storeDocuments()
  }

  storeDocuments() {
    //stringify the list of documnts
    let documents = JSON.stringify(this.documents)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    this.http.put('https://wdd430-4fd0c-default-rtdb.firebaseio.com/documents.json', documents, { headers: headers })
      .subscribe(() => {
        this.documentListChangedEvent.next(this.documents.slice());
      })
  }

}
