var express = require('express');
var User = require('../../models/User');
var router = express.Router();

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
    // User.find({}).exec(function(err, users) {
    //     res.status(200).json(users);
    // });
    res.sendFile(`${__dirname}/client/build.index.html`);
});

module.exports = router;
