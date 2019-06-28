const express = require('express');
const router = express.Router();
const passport = require('passport');
const isEmpty = require('../../validation/is-empty');

// Load playlist validation
const validatePlaylistInput = require('../../validation/playlist');

// Load Playlist model
const Playlist = require('../../models/Playlist');

//  @route GET api/playlists/
//  @description Get all playlists
//  @access Public
router.get('/all', (req, res) => {
    const errors = {};    

    Playlist.find()
        .sort({ createdAt: 'desc' })
        .then(playlists => res.json(playlists))
        .catch(() => {
            errors.playlists = 'No playlists found';
            return res.status(404).json(errors);
        });
});

//  @route GET api/playlists/
//  @description Get all playlists by user
//  @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};  
    // console.log(req.user);
      

    Playlist.find({ user: req.user._id })
        .sort({ createdAt: 'desc' })
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

//  @route GET api/playlists/user:username
//  @description Get all playlists by username
//  @access Public
// TODO: need to search for the user first to get their ID, then use their ID to search for thier playlist. Like above
// router.get('/user/:username', (req, res) => {
//     const errors = {};    

//     Playlist.find({ user: req.params.user_id })
//         .then(playlists => res.json(playlists))
//         .catch(() => {
//             errors.playlists = 'No playlists found';
//             return res.status(404).json(errors);
//         });
// });

//  @route GET api/playlists/:playlist_id
//  @description Get playlist by playlist ID
//  @access Public
// router.get('/:_id', (req, res) => {
//     const errors = {};    

//     Playlist.find({ _id: req.params._id })
//         .then(playlist => res.json(playlist))
//         .catch(() => {
//             errors.playlist = 'No playlists found';
//             return res.status(404).json(errors);
//         });
// });

//  @route GET api/playlists/:slug
//  @description Get playlist by playlist slug
//  @access Public
router.get('/:slug', (req, res) => {
    const errors = {};    

    Playlist.find({ slug: req.params.slug })
        .then(playlist => res.json(playlist))
        .catch(() => {
            errors.playlist = 'No playlists found via slug';
            return res.status(404).json(errors);
        });
});

//  @route POST api/playlist
//  @description Create or edit playlist
//  @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors } = validatePlaylistInput(req.body);
    
    // Check to see if slug already exists
    (async function doesSlugExist() {
        // NOTE/TODO Why have I wrapped this in promise???
        // Shouldn't I just perform all the below in the .then()
        let promise = new Promise((resolve, reject) => {
            Playlist.findOne({ slug: req.body.slug})
                .then((playlist) => {                    
                    if (playlist) {
                        if (playlist.id !== req.body.id) {
                            errors.slug = 'Slug already exists';
                            reject();
                        } else {
                            resolve('Slug is owned by this playlist, so update playlist');
                        }
                    } else {
                        resolve('no playlist found with that slug so create new playlist');
                    }
                }); 
                // throw Error('uh oh');
        }).catch(err => console.log('err: ', err));
        
        // Wait for promise to resvole or reject
        await promise;

        // Check for any validation errors or from slug check
        if (!isEmpty(errors)) {
            return res.status(400).json(errors);
        } else {
            const playlistFields = {
                user: req.user.id,
                name: req.body.name,
                slug: req.body.slug,
                desc: (req.body.description) ? req.body.description : ''
            }

            // Check to see if we're editing the playlist
            Playlist.findOne({ _id: req.body.id })
            .then(playlist => {
                
                if (playlist) {
                    // updating a profile
                    Playlist.findOneAndUpdate(
                        { _id: req.body.id },
                        { $set: playlistFields },
                        { new: true }
                    ).then(playlist => res.json(playlist))
                    .catch(error => console.log('error: ', error));
                } else {
                    // making a new profile
                    const playlist = new Playlist(playlistFields);
                    playlist.save(function(err, playlistModel) {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.status(201).send(playlistModel);
                    });
                }
            })
            .catch(err => {
                res.status(500).json(err);
            });
        }
    })(); // IIFE    
});

//  @route DELETE api/playlists/
//  @description Delete a playlist
//  @access Private
router.delete('/:playlist_id', 
    passport.authenticate('jwt', { session: false }), 
    (req, res) => {
        Playlist.findByIdAndDelete(req.params.playlist_id)
            .then(() => res.json({ success: true }))
            .catch(() => res.status(404).json({ success: false}));
        
    }
);

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
