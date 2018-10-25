const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const Base64 = require('js-base64').Base64;

// require('../models/qupp.models.js');


const PORT = 3333;

const {
    CLIENT_ID,
    CLIENT_SECRET
} = process.env;

const CLIENT_ID_SECRET_64 = Base64.encode(CLIENT_ID + ':' + CLIENT_SECRET);

const app = express();

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// set CORS headers on server as server listens on port 3333
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const spotifyAxios = axios.create({
    baseURL: 'https://accounts.spotify.com/api/token',
    timeout: 1000,
    headers: {
        'Authorization': 'Basic ' + CLIENT_ID_SECRET_64,
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
        grant_type: 'client_credentials'
    }
});

app.get('/songs', (req, res) => {
    Song.find({}).exec(function(err, songs) {
        res.status(200).json(songs);
    });
});

app.get('/authspotify', (req, res) => {
    spotifyAxios.post()
        .then((response) => {
            console.log(response.data.access_token);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        }
    );
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
    // Changed update/put request to be secure and not have the data in the parameters
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