const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load playlist validation
const validatePlaylistInput = require('../../validation/playlist');

// Load Playlist model
const Playlist = require('../../models/Playlist');



//  @route GET api/playlists/
//  @description Get all playlists
//  @access Public
router.get('/', (req, res) => {
    const errors = {};    

    Playlist.find()
        .then(playlists => res.json(playlists))
        .catch(() => {
            errors.playlists = 'No playlists found';
            return res.status(404).json(errors);
        });
});

//  @route GET api/playlists/user:user_id
//  @description Get all playlists by user
//  @access Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};    

    Playlist.find({ user: req.params.user_id })
        .then(playlists => res.json(playlists))
        .catch(() => {
            errors.playlists = 'No playlists found';
            return res.status(404).json(errors);
        });
});

//  @route GET api/playlists/:playlist_id
//  @description Get playlist by playlist ID
//  @access Public
router.get('/:_id', (req, res) => {
    const errors = {};    

    Playlist.find({ _id: req.params._id })
        .then(playlist => res.json(playlist))
        .catch(() => {
            errors.playlist = 'No playlists found';
            return res.status(404).json(errors);
        });
});

//  @route POST api/playlist
//  @description Create playlist
//  @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    // console.log(req.body);
    const { errors, isValid } = validatePlaylistInput(req.body);
    
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // Add edit playlist in here
    // Playlist.findOne

    // TODO see if res.body.slug is taken as slug should be unique
    
    var newPlaylist = {
        user: req.user.id,
        name: req.body.name,
        slug: req.body.slug,
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
