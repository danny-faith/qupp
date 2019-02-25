const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load playlist validation
const validatePlaylistInput = require('../../validation/playlist');

// Load Playlist model
const Playlist = require('../../models/Playlist');

//  @route POST api/playlist
//  @description Create playlist
//  @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.body);
    const { errors, isValid } = validatePlaylistInput(req.body);
    
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // Add edit playlist in here
    
    
    var newPlaylist = {
        user: req.user.id,
        name: req.body.name,
        desc: (req.body.description) ? req.body.description : ''
    }
    var playlist = new Playlist(newPlaylist);
    playlist.save(function(err, playlistModel) {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send(playlistModel);
    })
});

//  @route GET api/playlists/user:user_id
//  @description Get all playlists by user
//  @access Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    console.log('req.params.user_id: ', req.params.user_id);
    

    Playlist.find({ user: req.params.user_id })
        .then(playlists => {
            if (!playlists) {
                errors.playlists = 'No playlists found';
                res.status(404).json(errors);
            }
            res.json(playlists);
            console.log(playlists);
        })
});

/**
 * This `GET` endpoint is not currently used. But is just a simple
 * request for a playlist. For some reason its currently hardcoded to one
 * playlist id. This will later be dynamic.
 */

// router.get('/', (req, res) => {
//     Playlist.find({ _id: '5bdb2e61e508dc3b7e2bb325'}).exec(function(err, playlist) {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         res.status(200).json(playlist);
//     });
// });

/**
 * This endpoint is used to update the playlist name
 * the axios call that uses this endpoint is currently hardcoded to the only playlistin the program
 */

// router.put('/:playlistId', (req, res) => {
//     const { playlistId } = req.params;
//     Playlist.updateOne({ _id: playlistId }, req.body, function (err, raw) {
//         if (err) return handleError(err);
//         return res.sendStatus(200);
//     });
// });

module.exports = router;
