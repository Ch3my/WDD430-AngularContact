var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');
const Contact = require('../models/contact');

// GET route for messages
router.get('/', (req, res, next) => {
    //retrieve all messages using model
    Message.find()
        .populate('sender')
        .then(messages => {
            //return successful response
            res.status(200).json(
                messages
            );
        })
        .catch(error => {
            //return error if necessary
            console.log(error)
        });
}
);

//POST route to add messages
router.post('/', (req, res, next) => {
    //get unique id for new message
    const maxMessageId = sequenceGenerator.nextId("messages");

    var messageSender = Contact.findOne({ "id": req.body.sender.id }).then(sender => {
        // TODO. Catch if sender is not found
        console.log(sender)
        //create message based on input from request
        const message = new Message({
            id: maxMessageId,
            msgText: req.body.msgText,
            sender: sender._id,
            subject: req.body.subject
        });

        //save message to database
        message.save()
            .then(createdMessage => {
                //return successful response
                res.status(201).json({
                    message: 'Message added successfully',
                    newMessage: createdMessage,
                    senderId: sender.id
                });
            })
            .catch(error => {
                //retrn error if something happens
                console.log(error)
            });
    })

});

//PUT route to update messages
router.put('/:id', (req, res, next) => {
    //find the specifc message
    Message.findOne({ id: req.params.id })
        .then(message => {
            //replace data with what comes from requesst
            message.name = req.body.name;
            message.description = req.body.description;
            message.url = req.body.url;

            //update a specific message with the message object above
            Message.updateOne({ id: req.params.id }, message)
                .then(result => {
                    //send successful response
                    res.status(204).json({
                        message: 'Message updated successfully'
                    })
                })
                .catch(error => {
                    //return error if necessary
                    console.log(error)
                });
        })
        .catch(error => {
            //return error if couldn't find message
            res.status(500).json({
                message: 'Message not found.',
                error: { message: 'Message not found' }
            });
        });
});

//DELETE route for messages
router.delete("/:id", (req, res, next) => {
    //find specific message
    Message.findOne({ id: req.params.id })
        .then(message => {
            //delete the specific message
            Message.deleteOne({ id: req.params.id })
                .then(result => {
                    //send successful response
                    res.status(204).json({ message: "Message deleted successfully" });
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