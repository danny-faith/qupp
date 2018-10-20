const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// import routes
// import endPoints from './routes/qupp.server.route';

const PORT = 3333;
const app = express();

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// set CORS headers on server as server listens on port 3333
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

mongoose.Promise = global.Promise;
var promise = mongoose.connect('mongodb://localhost/qupp_db_EBDNBFJN');

promise.then(function(db) {
  console.log('DATABASE CONNECTED!!');
}).catch(function(err){
  console.log('CONNECTION ERROR', err);
});

var Schema = mongoose.Schema;

var artistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
});
var songSchema = new Schema({
    spotId: {
        type: String,
        unique : true,
        required : true,
        dropDups: true
    },
    name: {
        type: String,
        required : true
    },
    duration: Number,
    artists: [artistSchema],
    uri: String,
    album: String
});
var playlistSchema = new Schema({
    songs: [songSchema]
});


var Song = mongoose.model('Song', songSchema);
var Playlist = mongoose.model('Playlist', playlistSchema);
var Artist = mongoose.model('Artist', artistSchema);

// app.use('')

app.get('/songs', (req, res) => {
    Song.find({}).exec(function(err, songs) {
        res.status(200).json(songs);
    });
});

app.post('/songs', (req, res) => {
    var newSong = req.body;
    console.log(newSong);
    var song = new Song(newSong);
    song.save(function(err, songModel) {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.status(201).send(songModel);
    })
});

app.put('/songs/:songid', (req, res) => {
    var { songid } = req.params;
    console.log(songid);
    Song.updateOne({ _id: songid }, req.body, function (err, raw) {
        if (err) return handleError(err);
        console.log('The raw response from Mongo was ', raw);
        return res.sendStatus(200);
    });
});

app.delete('/songs/:songid', (req, res) => {
    var songToDelete = req.params.songid;
    console.log('songToDelete: ', songToDelete);
    Song.deleteOne({ _id : songToDelete }, function(err) {
        if (err) return handleError(err);
        res.sendStatus(204);
    });
});

app.listen(PORT, function() {
    console.log('listening on port 3333');
});