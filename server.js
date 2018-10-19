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

mongoose.Promise = global.Promise;
var promise = mongoose.connect('mongodb://localhost/qupp_db_EBDNBFJN');

promise.then(function(db) {
  console.log('DATABASE CONNECTED!!');
}).catch(function(err){
  console.log('CONNECTION ERROR', err);
});

var Schema = mongoose.Schema;
var songSchema = new Schema({
    title: String,
    artist: String
});

var Song = mongoose.model('Song', songSchema);

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