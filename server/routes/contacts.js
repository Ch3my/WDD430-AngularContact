var express = require('express');
const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');
var router = express.Router();

//GET route for contacts
router.get('/', (req, res, next) => {
    //find all contacts, populate the group
    Contact.find()
        .populate('group')
        .then(contacts => {
            //send successful response
            res.status(200).json(

                contacts
            );
        })
        .catch(error => {
            //return error response
        });
}
);

//GET route to get a single contact by id
router.get('/:id', (req, res, next) => {
    //find specific contact
    Contact.findOne({
        //retrieve id from params
        "id": req.params.id
    })
        //populate
        .populate('group')
        .then(contact => {
            res.status(200).json(
                contact);
        })
        .catch(error => {
        })
})

//POST route for adding contact
router.post('/', (req, res, next) => {
    //get unique id for adding new contact
    const maxContactId = sequenceGenerator.nextId("contacts");

    var groupMembersId = []
    if (req.body.group.length > 0) {
        //loop through all the group
        for (let groupContact of req.body.group) {
            //assign only the id to the group contact
            groupMembersId.push(groupContact._id)
        }
    }

    //create new contact with info from request
    const contact = new Contact({
        id: maxContactId,
        name: req.body.name,
        description: req.body.description,
        url: req.body.url,
        group: req.body.group,
        email: req.body.email,
    });


    //save to database
    contact.save()
        .then(createdContact => {
            //send succesful response
            res.status(201).json({
                message: 'Contact added successfully',
                contact: createdContact
            });
        })
        .catch(error => {
            //send error response
            console.log(error)
        });
});

//PUT route to update a single contact
router.put('/:id', (req, res, next) => {
    //find specific contact
    Contact.findOne({ id: req.params.id })
        .then(contact => {

            var groupMembersId = []
            if (req.body.group.length > 0) {
                //loop through all the group
                for (let groupContact of req.body.group) {
                    //assign only the id to the group contact
                    groupMembersId.push(groupContact._id)
                }
            }
            
            //modify fields with what comes from req
            contact.name = req.body.name;
            contact.description = req.body.description;
            contact.url = req.body.url;
            contact.group = groupMembersId;

            //update specific one
            Contact.updateOne({ id: req.params.id }, contact)
                .then(result => {
                    console.log(result)
                    //send successful response
                    res.status(204).json({
                        message: 'Contact updated successfully'
                    })
                })
                .catch(error => {
                    //send error response
                    console.log(error)
                });
        })
        .catch(error => {
            //send not found response
            res.status(500).json({
                message: 'Contact not found.',
                error: { contact: 'Contact not found' }
            });
            console.log(error)
        });
});

//DELETE route for contacts
router.delete("/:id", (req, res, next) => {
    //find specific contact by id
    Contact.findOne({ id: req.params.id })
        .then(contact => {
            //delete specific comtact by id
            Contact.deleteOne({ id: req.params.id })
                .then(result => {
                    //send successful rsponse
                    res.status(204).json({ message: "Contact deleted successfully" });
                })
                .catch(error => {
                    //send error response
                    console.log(error)
                })
        })
        .catch(error => {
            //send error response
            console.log(error)
        });
});

module.exports = router;