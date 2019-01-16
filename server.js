const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
require('dotenv').config();

mongoose.Promise = global.Promise;
var promise = mongoose.connect('mongodb://localhost/qupp_db_EBDNBFJN');

promise.then(function(db) {
  console.log('DATABASE CONNECTED!!');
}).catch(function(err){
  console.log('CONNECTION ERROR', err);
});

var Schema = mongoose.Schema;

const {
    PORT:pt,
    NODE_ENV
} = process.env;

const PORT = pt || 8080;

// TODO: add RegEx to schemas

const app = express();
app.use(cors());
app.use(require('cookie-parser')());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));
app.use(passport.initialize());
app.use(passport.session());

// need if statement around this to switch to look for the react build folder once in production
if (NODE_ENV === "development") {
    console.log('were in dev mode');
    app.use( express.static( `${__dirname}/client/public` ) );
} else if (NODE_ENV === "production") {
    console.log('were in prod mode');
    app.use( express.static( `${__dirname}/client/build` ) );
}
console.log('express static: ', `${__dirname}/client/build`);


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

/* Routes START
 *****************************************/


console.log('/* catch all path', `${__dirname}/client/build`);


var usersRouter = require('./routes/api/users.route');
var songsRouter = require('./routes/api/songs.route');
var playlistRouter = require('./routes/api/playlist.route');
var spotifyRouter = require('./routes/api/authSpotify.route');
var loginRouter = require('./routes/api/login.route');

// app.get('/', (req, res) => {
//     res.status(200).send();
// });

app.use('/api/users', usersRouter);
app.use('/songs', songsRouter);
app.use('/playlist', playlistRouter);
app.use('/authspotify', spotifyRouter);
// app.use('/login', loginRouter);

app.get('*', (req, res) => {
    console.log('triggered route');
    // res.json({stuff: 'HELLO WORLD'}); // comment
    // res.sendFile(`${__dirname}/client/build.index.html`);
    res.redirect('https://google.com');
});

/* Routes END
 *****************************************/




app.listen(process.env.PORT || 8080);