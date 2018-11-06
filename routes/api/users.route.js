var express = require('express');
var User = require('../../models/User');
var router = express.Router();

/* GET home page. */

router.post('/', (req, res) => {
    const newUser = req.body;
    const user = new User(newUser);
    user.setPassword(req.body.password);
    
    user.save(function(err, userModel) {
        if (err) {
            return res.status(500).send(err);
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
