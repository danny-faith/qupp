const express = require('express');
const User = require('../../models/User');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const genUserHash = require ('../utils/genUserHash');
// const passport = require('passport');
const isEmpty = require('../../validation/is-empty');
const nodemailer = require("nodemailer");

// Load validation
const validateRegisterInput = require('../../validation/register.js');
const validateLoginInput = require('../../validation/login.js');
const validateForgotPasswordInput = require('../../validation/forgotPassword.js');

require('dotenv').config();
const { 
    SECRET,
    SMTP_HOST, 
    SMTP_PORT, 
    SMTP_AUTH_USER, 
    SMTP_AUTH_PASS,
    ENV
} = process.env;

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
    const { errors } = validateRegisterInput(req.body);

    // Todo: could refactor this to two promises and use promise.all([emailPromise, usernamePromise]); to check for usernames and emails

    async function doesUsernameExist() {
        let promise = new Promise((resolve, reject) => {
            User.findOne({ username: req.body.username})
                .then((user) => {
                    if (user) {
                        errors.username = 'Username already exists';
                        resolve(errors);
                    } else {
                        reject('no username found');
                    }
                }); 
        }).catch(err => console.log(err));

        // Wait for promise to resvole or reject then run doesEmailExist
        await promise;

        doesEmailExist();
    }

    async function doesEmailExist() {
        let promise = new Promise((resolve, reject) => {
            User.findOne({ email: req.body.email})
                .then((user) => {
                    if (user) {
                        errors.email = 'Email already exists';
                        resolve(errors);
                    } else {
                        reject('No Email found');
                    }
                }); 
        }).catch(err => console.log(err));

        // Wait for promise to resvole or reject then carry on with adding a new user if there were no errors
        await promise;

        // This only runs after the above await promise finishes
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

    // Start username and email duplicate checking process which leads to adding user if username and email are avaliable
    // Could switch this to an IIFE to avoid this call below
    doesUsernameExist();    
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

//  @route POST api/users/forgot-password
//  @description Find user's email address and send forgot password email
//  @access Public
router.post('/forgot-password', (req, res) => {
    const { errors, isValid } = validateForgotPasswordInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                errors.email = "No account found";
                return res.status(404).json(errors);
            }
            // User found, carry on
            // const hash = genUserHash('daniel.e.blythe');

            // Generate hash
            const hash = `847698468926489526789523985762894`; // expires in 1 hour
            user.resetPasswordToken = hash;
            user.resetPasswordTokenExpires = Date.now() + 60000;
            
            // Setup email
            // The below shouldn't be here. Should be in a config file somewhere
            const transporter = nodemailer.createTransport({
                host: SMTP_HOST,
                port: SMTP_PORT,
                auth: {
                    user: SMTP_AUTH_USER,
                    pass: SMTP_AUTH_PASS
                }
            });
            
            // Setup email options
            const mailOptions = {
                from: '"qupp" <resetpassword@qupp.co.uk>',
                to: req.body.email,
                subject: "qupp: password reset",
                text: "This is an email test using Mailtrap.io",
                // change localhost to read from .env file
                html: `<a href='${ENV}/reset-password?email=${req.body.email}&token=${hash}'>Password reset link</a>`
            };
            
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                    errors.mailFailed = "There was an error sending the email";
                    return res.status(500).json(errors);
                }
                // console.log("Info: ", info);
                // if sending email successful store against user along with whether or not token has been used
                user.save()
                    .then(user => res.json(user))
                    .catch(err => res.status(500).json(err));

                // return res.json(user);
            });

            return res.json(user);
        })
        .catch(err => res.json(err));
});

router.post('/verify-password-reset', (req, res) => {
    const errors = {};

    User.findOne({ resetPasswordToken: req.body.token, resetPasswordTokenExpires: { $gt: Date.now() } })
        .then(user => {
            // console.log('user.resetPasswordToken: ', user.resetPasswordToken);
            // console.log('req.body.token: ', req.body.token););
            if (!user) {
                errors.verifyPasswordRest = 'Password reset token is invalid or has expired.';
                return res.status(400).json(errors);
            }
            console.log('its all good bro, reset that password');
            
            // Decode token
            // Extract expiry date / time

            // if (user.resetPasswordTokenUsed) {
            //     errors.verifyPasswordRest = 'Password reset token has been used, please create another on the Forgot password page.';
            // }
            
            // if (tokenHasTimeExpired) {
            //     errors.verifyPasswordRest = 'Token has expired. Please create another on the Forgot password page.';
            // }

            // // bcrypt.compare()
            // if (!user.resetPasswordToken === req.body.token) {
            //     // return errors.tokenMatch = 'Tokens did not match';
            //     errors.verifyPasswordRest = 'Tokens did not match';
            // }
            
            // if (!user) {
            //     errors.verifyPasswordRest = 'Email address does not exist';
            // }

            
            return res.json(user)
        })
        .catch(err => res.status(404).json(err));
});

// router.post('/verify-password-reset', (req, res) => {
//     const errors = {};

//     User.findOne({ email: req.body.email })
//         .then(user => {
//             // console.log('user.resetPasswordToken: ', user.resetPasswordToken);
//             // console.log('req.body.token: ', req.body.token););
            
//             // Decode token
//             // Extract expiry date / time

//             if (user.resetPasswordTokenUsed) {
//                 errors.verifyPasswordRest = 'Password reset token has been used, please create another on the Forgot password page.';
//             }
            
//             if (tokenHasTimeExpired) {
//                 errors.verifyPasswordRest = 'Token has expired. Please create another on the Forgot password page.';
//             }

//             // bcrypt.compare()
//             if (!user.resetPasswordToken === req.body.token) {
//                 // return errors.tokenMatch = 'Tokens did not match';
//                 errors.verifyPasswordRest = 'Tokens did not match';
//             }
            
//             if (!user) {
//                 errors.verifyPasswordRest = 'Email address does not exist';
//             }

            
//             return res.json(user)
//         })
//         .catch(err => res.json(err));
// });

module.exports = router;
