var express = require('express');
var User = require('../../models/User');
var router = express.Router();

/* GET home page. */

router.post('/', (req, res) => {
    const newUser = req.body;
    // console.log(req.body.password);
    const user = new User(newUser);
    user.setPassword(req.body.password);
    // console.log(passwordSuper);
    
    user.save(function(err, userModel) {
        if (err) {
            // as I dont send a status, axios doesnt realise theres an error and so it doesn get caught by the catch.
            // add status back in and figure out why you cant send a status and the err object
            return res.send(err);
        }
        res.status(201).send(userModel);
    })
});

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

router.get('/', (req, res) => {
    User.find({}).exec(function(err, users) {
        res.status(200).json(users);
    });
});

module.exports = router;
