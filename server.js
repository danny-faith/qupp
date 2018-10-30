const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const Base64 = require('js-base64').Base64;
var passport = require('passport');
const jwt = require('jsonwebtoken');
var LocalStrategy = require('passport-local').Strategy;


mongoose.Promise = global.Promise;
var promise = mongoose.connect('mongodb://localhost/qupp_db_EBDNBFJN');

promise.then(function(db) {
  console.log('DATABASE CONNECTED!!');
}).catch(function(err){
  console.log('CONNECTION ERROR', err);
});

var Schema = mongoose.Schema;
// var artistSchema = new Schema({
//     name: {
//         type: String,
//         required: true
//     }
// });
// var songSchema = new Schema({
//     spotId: {
//         type: String,
//         unique : true,
//         required : true,
//         dropDups: true
//     },
//     name: {
//         type: String,
//         required : true
//     },
//     duration: Number,
//     artists: [artistSchema],
//     uri: String,
//     album: String,
//     image: String
// });
// var playlistSchema = new Schema({
//     name: String,
//     desc: String,
//     createdAt : {
//         type: Date,
//         default: Date.now
//     },
//     songs: [songSchema]
// });

// var Song = mongoose.model('Song', songSchema);

// require('./routes/qupp.server.route.js');
const User = require('./models/User');
const Song = require('./models/Song');
const songSchema = Song.schema.obj;

var playlistSchema = new Schema({
    name: String,
    desc: String,
    createdAt : {
        type: Date,
        default: Date.now
    },
    songs: [songSchema]
});

// console.log(Song.schema.obj);

// const Playlist = require('./models/Playlist');


require('dotenv').config();

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

// app.use('')

// app.post('/login', (req, res) => {
//     console.log('trying to login: ', req.body);
//     res.status(200).send(req.body);
// });

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
            successRedirect: `http://localhost:${PORT}/`,
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

var songsRouter = require('./routes/api/songs.route');
var spotifyRouter = require('./routes/api/authSpotify.route');
// var deleteSongRouter = require('./routes/api/deleteSong.route');
app.use('/songs', songsRouter);
app.use('/authspotify', spotifyRouter);
// app.use('/songs', addSongRouter);

/* Routes END
 *****************************************/

app.get('/users/:username', (req, res, next) => {
    var { username } = req.params;
    User.find({ username: username }).exec(function(err, user) {
        if (err) {
            next();
        } else {
            res.status(200).json(user);
        }
    });
});

app.get('/users', (req, res) => {
    User.find({}).exec(function(err, songs) {
        res.status(200).json(users);
    });
});

app.post('/user', (req, res) => {
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

// app.get('/songs', (req, res) => {
//     Song.find({}).exec(function(err, songs) {
//         res.status(200).json(songs);
//     });
// });

// app.get('/authspotify', (req, res) => {
//     spotifyAxios.post()
//         .then((response) => {
//             // console.log(response.data.access_token);
//             res.status(200).json(response.data);
//         })
//         .catch((error) => {
//             // console.log(error);
//             res.status(500).json(error);
//         }
//     );
// });

// app.post('/songs', (req, res) => {
//     var newSong = req.body;
//     console.log(newSong);
//     var song = new Song(newSong);
//     song.save(function(err, songModel) {
//         if (err) {
//             console.log(err);
//             return res.status(500).send(err);
//         }
//         res.status(201).send(songModel);
//     })
// });

app.put('/songs/:songid', (req, res) => {
    var { songid } = req.params;
    // console.log(songid);
    Song.updateOne({ _id: songid }, req.body, function (err, raw) {
        if (err) return handleError(err);
        console.log('The raw response from Mongo was ', raw);
        return res.sendStatus(200);
    });
});

// app.delete('/songs/:songid', (req, res) => {
//     var songToDelete = req.params.songid;
//     // console.log('songToDelete: ', songToDelete);
//     Song.deleteOne({ _id : songToDelete }, function(err) {
//         if (err) return handleError(err);
//         res.sendStatus(204);
//     });
// });
// app.listen(process.env.PORT || 8080);
app.listen(PORT, function() {
    console.log('listening on port 8080');
});