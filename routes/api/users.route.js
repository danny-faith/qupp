var express = require('express');
var User = require('../../models/User');
var router = express.Router();
const validateRegisterInput = require('../../validation/register.js');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

/**
 * Endpoint: Create and add new user. `password` method creates an encrypted/hashed
 * password using the password supplied by the user and sent in the body
 */

router.post('/', (req, res) => {
    const newUser = req.body;
    const user = new User(newUser);
    user.setPassword(req.body.password); // method that creates the users password
    
    user.save(function(err, userModel) {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send(userModel);
    })
});

/**
 * Endpoint: Not currently used. But simply returns an object containing the users details
 * given the search term of the users username.
 */

router.get('/:username', (req, res, next) => {
    console.log('get user');
    
    var { username } = req.params;
    User.find({ username: username }).exec(function(err, user) {
        if (err) {
            next();
        } else {
            res.status(200).json(user);
        }
    });
});

/**
 * Endpoint: Not currently used. Simply returns all users.
 */

router.get('/', (req, res) => {
    console.log('/login route requested');    
    res.sendFile(`${__dirname}/client/build.index.html`);
});

//  @route GET api/users/register
//  @description Register user
//  @access Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                errors.email = 'Email already exists';
                return res.status(400).json(errors);
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // Size
                    r: 'pg', // Rating
                    d: 'mm', // Default
                });
                const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    avatar: avatar,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        });
});

module.exports = router;
