var express = require('express');
var Playlist = require('../../models/Playlist');
var router = express.Router();

/* Update Playlist */
router.post('/', (req, res) => {
    // var newPlaylist = req.body;
    var newPlaylist = {
        name: 'something funky',
        desc: 'A description'
    }
    console.log(newPlaylist);
    var playlist = new Playlist(newPlaylist);
    playlist.save(function(err, playlistModel) {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.status(201).send(playlistModel);
    })
  });

router.put('/:playlistId', (req, res) => {
    const { playlistId } = req.params;
    
    Playlist.updateOne({ _id: playlistId }, req.body, function (err, raw) {
        console.log('The raw response from Mongo was ', raw);
        if (err) return handleError(err);
        return res.sendStatus(200);
    });
});

module.exports = router;