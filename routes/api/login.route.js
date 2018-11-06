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
        // set JWT token here
        
        return done(null, user);
      });
    }
  ));

// app.post('/login', passport.authenticate('local', { successRedirect: '/success', failureRedirect: 'http://localhost:3000/login' }), (req, res) => {
//     console.log('trying to login: ', req.user.username);
//     res.status(200).send(req.user.username);
// });

router.post('/', 
    passport.authenticate('local', 
        { 
            // successRedirect: `/`,
            // failureRedirect: `http://localhost:${PORT}/login`,
            session: false
        }
    ), (req, res) => {
        console.log('res: ', res);
        
        // console.log('herro', req.user); // this wont run if `successRedirect` is being used
        res.redirect(`/?username=${req.user.username}&avatar=${req.user.image}`);
        // res.redirect(`/?username=${req.user.username}`);        
        // jwt.sign({user: req.user}, 'secretKey', (err, token) => {
        //     // let JWTjj = token;
        //     res.json({token});
        // });
        // console.log('JWT: ', JWTjj);
        
    }
);

// router.post('/', function(req, res, next ){
//     passport.authenticate('local', function(err, user, info) {
//       if (err) { return next(err) }
//       if (!user) { return res.json( { message: info.message }) }
//       res.status(500).json(user);
//     //   res.redirect(`/?username=${req.user.username}&avatar=${req.user.image}`);
//     })(req, res, next);   
// });

// app.post('/login', function(req, res, next ){
//     passport.authenticate('local', function(err, user, info) {
//       if (err) { return next(err) }
//       if (!user) { return res.json( { message: info.message }) }
//       res.json(user);
//     })(req, res, next);   
// });

module.exports = router;
