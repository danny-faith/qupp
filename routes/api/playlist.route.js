var express = require('express');
var Playlist = require('../../models/Playlist');
var router = express.Router();

/* Update Playlist */

router.put('/', (req, res) => {
    var { newPlaylistName } = req.params;
    Playlist.updateOne({ _id: '5bd9c82852c9ea0dd5af0c64' }, req.body, function (err, raw) {
        if (err) return handleError(err);
        return res.sendStatus(200);
    });
});

module.exports = router;
