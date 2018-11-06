const express = require('express');
const User = require('../../models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const router = express.Router();

const {
    PORT:pt
} = process.env;

const PORT = pt || 8080;

/* GET home page. */

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
            console.log('Incorrect username.');
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.validPassword(password) === false) {
            console.log('wrong password');
            return done(null, false, { message: 'Incorrect password.' });
        }
        console.log('Login SUCCESSFUL');
        
        return done(null, user);
      });
    }
  ));

router.post('/', 
    passport.authenticate('local', 
        { 
            // successRedirect: `/`,
            // failureRedirect: `http://localhost:${PORT}/login`,
            session: false
        }
    ), (req, res, next) => {
        res.redirect(`/?username=${req.user.username}&avatar=${req.user.image}`);
        // jwt.sign({user: req.user}, 'secretKey', (err, token) => {
        //     // let JWTjj = token;
        //     res.json({token});
        // });
    }
);

module.exports = router;
