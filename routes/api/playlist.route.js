var express = require('express');
var Playlist = require('../../models/Playlist');
var router = express.Router();

/*
 * This `POST` enpoint will later be modified and used to create new playlists
 */

router.post('/', (req, res) => {
    var newPlaylist = {
        name: 'something funky',
        desc: 'A description'
    }
    var playlist = new Playlist(newPlaylist);
    playlist.save(function(err, playlistModel) {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send(playlistModel);
    })
});

/**
 * This `GET` endpoint is not currently used. But is just a simple
 * request for a playlist. For some reason its currently hardcoded to one
 * playlist id. This will later be dynamic.
 */

router.get('/', (req, res) => {
    Playlist.find({ _id: '5bdb2e61e508dc3b7e2bb325'}).exec(function(err, playlist) {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(playlist);
    });
});

/**
 * This endpoint is used to update the playlist name
 * the axios call that uses this endpoint is currently hardcoded to the only playlistin the program
 */

router.put('/:playlistId', (req, res) => {
    const { playlistId } = req.params;
    Playlist.updateOne({ _id: playlistId }, req.body, function (err, raw) {
        if (err) return handleError(err);
        return res.sendStatus(200);
    });
});

module.exports = router;
