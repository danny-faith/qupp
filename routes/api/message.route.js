const express = require('express');
const router = express.Router();
const passport = require('passport');
const isEmpty = require('../../validation/is-empty');

// Load Message model
const Message = require('../../models/Message');

//  @route GET api/message
//  @description Get duo message
//  @access Private
router.get('/:user', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (isEmpty(req.user.id)) {
        return res.status(404).json({ msg: 'No primary user in request'});
    }
    // TODO: change `req.user.username` to `req.user._id`
    Message.find({ users: { $all: [req.user.username, req.params.user] } })
        .then(message => {
            if (message.length === 0) {
                return res.status(404).json({ msg: 'No message room found' });
            } else {
                return res.json(message);
            }
        })
        .catch(err => console.log(err));
});

//  @route POST api/message
//  @description Create duo message
//  @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    let { users } = req.body;
    users = users.split(',');
    
    Message.find({ users: { $all: [users[0], users[1]] } })
        .then(message => {
            if (message.length === 0) {
                // Create message
                const messageFields = {
                    type: 'duo',
                    users: [users[0], users[1]]
                }
                const message = new Message(messageFields);
                message.save(function(err, messageModel) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.status(201).send(messageModel);
                });
            } else {
                // Message room already exists
                return res.status(405).json({msg: 'Message room already exists', message: message});
            }
        })
        .catch(err => console.log('err: ', err));
});

module.exports = router;