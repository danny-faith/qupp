const express = require('express');
const admin = require('firebase-admin');
const User = require('../../models/User');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const isEmpty = require('../../validation/is-empty');
const nodemailer = require("nodemailer");
const passport = require('passport');
const multer  = require('multer');


// Load validation
const validateRegisterInput = require('../../validation/register.js');
const validateLoginInput = require('../../validation/login.js');
const validateForgotPasswordInput = require('../../validation/forgotPassword.js');
const validateSetPassword = require('../../validation/setPassword.js');

require('dotenv').config();
const { 
    SECRET,
    SMTP_HOST, 
    SMTP_PORT, 
    SMTP_AUTH_USER, 
    SMTP_AUTH_PASS,
    ENV,
    // GOOGLE_APPLICATION_CREDENTIALS,
    FIREBASE_DB_URL,
} = process.env;
  

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

//  @route POST api/users/login
//  @description Login User / Returning JWT Token
//  @access Public
router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);
    
    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    const { usernameOrEmail } = req.body;
    const { password } = req.body;
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmail = usernameOrEmail.match(regex) || [];
    const loginIdentifier = (isEmail.length === 0) ? 'username' : 'email';
    
    User.findOneAndUpdate({ [loginIdentifier]: usernameOrEmail }, { online: true }, { useFindAndModify: false })
        .then(user => {
            //  Check for user
            
            if (!user) {
                errors.usernameOrEmail = 'User not found';
                return res.status(404).json(errors);
            }

            //  Check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User matched
                        const payload = { id: user.id, username: user.username, avatar:user.avatar } // create payload
                        
                        // Create custom Firebase token
                        admin.initializeApp({
                            credential: admin.credential.applicationDefault(),
                            databaseURL: FIREBASE_DB_URL
                        });

                        let customToken
                        console.log('user', user);
                    
                        admin
                            .auth()
                            .createCustomToken('special')
                            .then((res) => {
                                // Send token back to client
                                customToken = res
                            })
                            .catch((error) => {
                                console.log('Error creating custom token:', error);
                            });

                        // Sign token
                        jwt.sign(payload, SECRET, { expiresIn: 3600}, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token,
                                firebaseToken: customToken
                            });
                        });
                        
                    } else {
                        errors.password = 'Password incorrect';
                        return res.status(400).json(errors);
                    }
                });
        });// .catch
});

//  @route POST api/users/update-token
//  @description Return new JWT
//  @access Private
router.post('/update-token', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    const payload = { id: req.body._id, username: req.body.username, avatar: req.body.avatar } // create payload
    // Sign token
    jwt.sign(payload, SECRET, { expiresIn: 3600}, (err, token) => {
        res.json({
            success: true, 
            token: 'Bearer ' + token,
            user: req.body
        });
    });
});

//  @route POST api/users/forgot-password
//  @description Find user's email address and send forgot password email
//  @access Public
router.post('/forgot-password', (req, res) => {
    console.log('HELLO!');
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
            
            const token = crypto.randomBytes(20).toString('hex');
            
            user.resetPasswordToken = token;
            user.resetPasswordTokenExpires = Date.now() + 3600000; // expires in 1 hour
            
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
                html: `<a href='${ENV}/reset-password?token=${token}'>Password reset link</a>`
            };
            
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    errors.mailFailed = "There was an error sending the email";
                    errors.err = err
                    return res.status(500).json(errors);
                }
                // if sending email successful store against user along with whether or not token has been used
                user.save()
                    .then(user => res.json(user))
                    .catch(err => res.status(500).json(err));

            });
        })
        .catch(err => res.json(err));
});

//  @route POST api/users/forgot-password-reset
//  @description Reset password
//  @access Private (can be accessed publicly if user has token)
// TODO USe code below and make this route still works
// passport.authenticate('jwt', { session: false })
//  Maybe not as users without toke will instantly get turned away.
// route needs to be Public but only with token. And if no token then user must be able to send isAuthenticated true.
// Now I think about it, someone could pass isAuthenticated === true via React dev tools and bypass the token stage, I think anyway. Must test
router.post('/forgot-password-reset', (req, res) => {
    const { errors, isValid } = validateSetPassword(req.body);
    const { token, password, isAuthenticated, userId } = req.body;
    
    if (!isValid) {
        return res.status(400).json(errors);
    }
    if (!isAuthenticated) {
        User.findOne({ resetPasswordToken: token, resetPasswordTokenExpires: { $gt: Date.now() } })
            .then(user => {            
    
                // If no user is returned then token doesnt exist or 
                if (!user) {
                    errors.verifyPasswordRest = 'Password reset token is invalid or has expired.';
                    return res.status(400).json(errors);
                }
    
                // Clear password reset token and reset expiry time
                user.resetPasswordToken = '';
                user.resetPasswordTokenExpires = '';
    
                // Generate hash of new password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;
                        user
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            })
            .catch(err => res.status(404).json(err));
    } else {
        User.findOne({ _id: userId })
            .then(user => {
                // Generate hash of new password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;
                        user
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            })
            .catch(err => res.status(404).json(err));
    }
});

//  @route POST api/users/avatar
//  @description Upload an avatar for the current user
//  @access Private
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `client/${(process.env.ENV === 'http://localhost:3002' ? 'public' : 'build')}/uploads/avatars/`)
    },
    filename: function (req, file, cb) {
        const regex = / /gi;
        cb(null, `${new Date().toISOString()}-${file.originalname.replace(regex, '-')}`)
    }
});
const fileFilter = (req, file, cb) => {
    const acceptedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (acceptedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('File type not accepted'), false);
    }
}
const avatarUpload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 4
    } 
}).single('avatar');

router.post(
    '/avatar', 
    passport.authenticate('jwt', { session: false }), 
    (req, res) => {
        // console.log('uploading avatar');
        
        const errors = {};
        
        avatarUpload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                
                errors.filesize = err.message;
                return res.status(413).json(errors);
                
            } else if (err) {
                // catch all other errors including unknown and fileFilter errors
                errors.error = err.message;
                return res.status(500).json(errors);
            }
            // console.log('req.user', req.user);
            User.findById(req.user.id)
                .then((user) => {
                    user.avatar = `uploads/avatars/${req.file.filename}`;
                    
                    user.save()
                        .then((user) => res.json(user))
                        .catch(err => console.log(err));
                })
                .catch((err) => {
                    res.status(500).json(err);      
                });
            })
    }
);

//  @route PUT api/users/:userId
//  @description Update users email or lastOnline time
//  @access Private
router.put('/:userId', passport.authenticate('jwt', { session: false }), (req, res) => {
    // console.log('req.body: ', req.body);
    
    User.findOne({ _id: req.params.userId })
        .then(user => {
            // console.log('user: ', user);
            user.email = (!isEmpty(req.body.email)) ? req.body.email : user.email;
            user.lastOnline = (!isEmpty(req.body.lastOnline)) ? req.body.lastOnline : user.lastOnline;
            // console.log('user.lastOnline: ', user.lastOnline);
            user.save()
                .then((user) => res.json(user))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));

    // res.json(req.params.userId);
});

//  @route GET api/users/current
//  @description Returns current users
//  @access Private
// TODO remove as was a test route
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

//  @route GET api/users/all
//  @description Returns all users
//  @access Private
router.get('/all', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => console.log(err));
});

module.exports = router;
