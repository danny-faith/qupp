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

/*
 * Setup Passport to use local strategy as I'm not currently using any third parties (Facebook, Github etc)
 */

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.validPassword(password) === false) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        
        return done(null, user);
      });
    }
));

/*
 * `POST` endpoint. Using passport.authticate to authenticate the user. Username and password are passed through as parameters to
 * this endpoint from the `src/components/LoginForm.js` file via axios.
 * Couple of comments below kept in for reference and for ease.
 */

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

router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = router;
