const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
require('dotenv').config();

const { 
    SECRET
} = process.env;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET;

module.exports = (passport) => {
    // console.log('opts.jwtFromRequest: ', opts.jwtFromRequest);
    
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            // console.log('step 1', jwt_payload.id);
            
            User.findById(jwt_payload.id)
                .then(user => {
                    // console.log('founder user: ', user);
                    
                    if (user) {
                        console.log('User found and Auth success');
                        
                        return done(null, user);
                    }
                    console.log('User NOT found and Auth failed');
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
    );
};
