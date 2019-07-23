const express = require('express');
const router = express.Router();
const passport = require('passport');
const isEmpty = require('../../validation/is-empty');

// Load Message model
const Message = require('../../models/Message');

//  @route POST api/message
//  @description Create message
//  @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.body);
    
    let { users } = req.body;
    users = users.split(',');
    console.log(users[0])
    
    const messageFields = {
        type: 'duo',
        users: [users[0], users[1]]
    }
    // Message.save(newMessage)
    //     .then(message => res.json(message))
    //     .catch(err => console.log(err));
    const message = new Message(messageFields);
    message.save(function(err, messageModel) {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send(messageModel);
    });
    // res.json({message: 'sent'})
});

module.exports = router;