const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const Base64 = require('js-base64').Base64;
var passport = require('passport');
const jwt = require('jsonwebtoken');
var LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

mongoose.Promise = global.Promise;
var promise = mongoose.connect('mongodb://localhost/qupp_db_EBDNBFJN');

promise.then(function(db) {
  console.log('DATABASE CONNECTED!!');
}).catch(function(err){
  console.log('CONNECTION ERROR', err);
});

var Schema = mongoose.Schema;

const User = require('./models/User');
// const Song = require('./models/Song');
// const Playlist = require('./models/Playlist');
// const songSchema = Song.schema.obj;
// songs: [songSchema]


const {
    PORT:pt
} = process.env;

const PORT = pt || 8080;

// const CLIENT_ID_SECRET_64 = Base64.encode(CLIENT_ID + ':' + CLIENT_SECRET);

// import routes
// import endPoints from './routes/qupp.server.route';
// TODO: add RegEx to schemas
// TODO: use MAterilize modal to tell user if a duplicate has been entered

// const spotifyAxios = axios.create({
//     baseURL: 'https://accounts.spotify.com/api/token',
//     timeout: 1000,
//     headers: {
//         'Authorization': 'Basic ' + CLIENT_ID_SECRET_64,
//         'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     params: {
//         grant_type: 'client_credentials'
//     }
// });

// const PORT = 8080;
const app = express();

// const whitelist = ['http://localhost:8080'];
// var corsOptions = {
//     origin: function (origin, callback) {
//       if (whitelist.indexOf(origin) !== -1) {
//         callback(null, true)
//       } else {
//         callback(new Error('Not allowed by CORS...'))
//       }
//     }
//   }
// app.use(cors(corsOptions));
app.use(cors());

app.use(require('cookie-parser')());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// set CORS headers on server as server listens on port 8080
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// var Playlist = mongoose.model('Playlist', playlistSchema);
// var Artist = mongoose.model('Artist', artistSchema);

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

app.post('/login', 
    passport.authenticate('local', 
        { 
            successRedirect: `http://localhost:3001/`,
            failureRedirect: `http://localhost:${PORT}/login`,
            session: false
        }
    ), (req, res) => {
        
        console.log('herro'); // this wont run if `successRedirect` is being used
        // res.redirect('/');
        // res.redirect(`/?username=${req.user.username}`);        
        // jwt.sign({user: req.user}, 'secretKey', (err, token) => {
        //     // let JWTjj = token;
        //     res.json({token});
        // });
        // console.log('JWT: ', JWTjj);
        
    }
);

/* Routes START
 *****************************************/
var usersRouter = require('./routes/api/users.route');
var songsRouter = require('./routes/api/songs.route');
var playlistRouter = require('./routes/api/playlist.route');
var spotifyRouter = require('./routes/api/authSpotify.route');

app.use('/users', usersRouter);
app.use('/songs', songsRouter);
app.use('/playlist', playlistRouter);
app.use('/authspotify', spotifyRouter);

/* Routes END
 *****************************************/


app.listen(process.env.PORT || 8080);
// app.listen(PORT, function() {
//     console.log('listening on port 8080');
// });