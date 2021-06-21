var express = require('express');
const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');

var router = express.Router();

//GET the list of documents in the documents collection in the database.
router.get('/', (req, res, next) => {
    //retrieve all documents
    console.log('Estamos en la ruta')
    Document.find()
        .then(documents => {
            console.log('Leimos documentos')
            //send scucessful response with mssage and documents
            res.status(200).json(
                documents
            );
        })
        .catch(error => {
            //return error if something happens
            console.log(error)
            res.status(500).json({
                err: error
            })
        });
})

//POST route to adding a document to database
router.post('/', (req, res, next) => {
    //call sequence generator to get unique id
    const maxDocumentId = sequenceGenerator.nextId("documents");

    //create new document
    const document = new Document({
        id: maxDocumentId,
        name: req.body.name,
        description: req.body.description,
        url: req.body.url
    });

    //save document to database
    document.save()
        .then(createdDocument => {
            //send successful response with message and new document added
            res.status(201).json({
                message: 'Document added successfully',
                document: createdDocument
            });
        })
        .catch(error => {
            //retunr error if something happens
            console.log(error)
        });
});

//Route to UPDATE a document in the database
router.put('/:id', (req, res, next) => {
    //find document with specific id passed on parameter
    Document.findOne({ id: req.params.id })
        .then(document => {
            //re assign values with those comign from request
            document.name = req.body.name;
            document.description = req.body.description;
            document.url = req.body.url;

            //update entire document
            Document.updateOne({ id: req.params.id }, document)
                .then(result => {
                    //send successful response
                    res.status(204).json({
                        message: 'Document updated successfully'
                    })
                })
                .catch(error => {
                    //return error in case something happens
                    console.log(error)
                });
        })
        .catch(error => {
            //respnse with error if not found
            res.status(500).json({
                message: 'Document not found.',
                error: { document: 'Document not found' }
            });
        });
});

//Route to DELETE document from database
router.delete("/:id", (req, res, next) => {
    //find document by id
    Document.findOne({ id: req.params.id })
        .then(document => {
            //delete such document
            Document.deleteOne({ id: req.params.id })
                .then(result => {
                    //response with succesful message
                    res.status(204).json({ message: "Document deleted successfully" });
                })
                .catch(error => {
                    //return error if something happened
                    console.log(error)
                })
        })
        .catch(error => {
            //return error if something happened
            console.log(error)
        });
});

module.exports = router;
