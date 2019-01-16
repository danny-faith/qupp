var express = require('express');
var User = require('../../models/User');
var router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const isEmpty = require('../../validation/is-empty');

// Load validation
const validateRegisterInput = require('../../validation/register.js');
const validateLoginInput = require('../../validation/login.js');

require('dotenv').config();
const { SECRET } = process.env;

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

    // errors.username = (user.username === req.body.username) ? 'Username already exists' : null;
    // console.log('errors: ', errors);
    // check to see if username is taken with User.findOne

    // do same as validation file and check first for email address and if found add error message to errors obj
    // then do the same for username, adding to errors obj if needed
    // finally if errors obj is empty then build new user and save

    async function doesUsernameExist() {
        console.log('start username promise');
        
        let promise = new Promise((resolve, reject) => {
            User.findOne({ username: req.body.username})
            .then((user) => {
                // console.log('username ', user);
                // console.log('we found a user with that username');
                console.log('looking for username');
                
                if (user) {
                    console.log('username found');
                    errors.username = "Username already exists";
                    resolve(errors);
                } else {
                    reject();
                }
            }); 
        });

        let result = await promise;

        console.log('Username result: ', result);
        doesEmailExist();
        // return result;
    }

    async function doesEmailExist() {
        console.log('start email promise');
        
        let promise = new Promise((resolve, reject) => {
            User.findOne({ email: req.body.email})
            .then((user) => {
                // console.log('username ', user);
                // console.log('we found a user with that username');
                console.log('looking for email');
                
                if (user) {
                    console.log('email found');
                    errors.email = "Username already exists";
                    resolve(errors);
                } else {
                    reject();
                }
            }); 
        });

        let result = await promise;
        

        console.log('Email result: ', result);
        // return result;
        console.log('here are the errors: ', errors);
        

        if (!isEmpty(errors)) { 
            // Errors are present so return and send errors
            return res.status(400).json(errors);
        } else {
            // Create new user
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
        
    }

    doesUsernameExist();    

    // User.findOne({ username: req.body.username})
    //     .then((user) => {
    //         // console.log('username ', user);
    //         console.log('we found a user with that username');
            
    //         if (user) {
    //             errors.username = "Username already exists";
    //         }
    //     });


    // User.findOne({ email: req.body.email })
    //     .then((user) => {
    //         console.log('something');
            
    //         if (user) {
    //             console.log('email ', user);
    //             console.log('we found a user with that email');            
    //             errors.email = 'Email already exists';
    //             return res.status(400).json(errors);
    //         }   
    //     });

        // console.log('here are the errors: ', errors);
    
});

//  @route GET api/users/login
//  @description Login User / Returning JWT Token
//  @access Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    const { email } = req.body;
    const { password } = req.body;
    User.findOne({email})
        .then(user => {
            //  Check for user
            if (!user) {
                errors.email = 'User not found';
                return res.status(404).json(errors);
            }

            //  Check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User matched
                        const payload = { id: user.id, name: user.username, avatar:user.avatar } // create payload
                        // Sign token
                        jwt.sign(payload, SECRET, { expiresIn: 3600}, (err, token) => {
                            res.json({success: true, token: 'Bearer ' + token});
                        });
                        
                    } else {
                        errors.password = 'Password incorrect';
                        return res.status(400).json(errors);
                    }
                });
        });// .catch
});

module.exports = router;
