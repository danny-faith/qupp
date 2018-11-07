const express = require('express');
const Song = require('../../models/Song');
const router = express.Router();

/**
 * The below endpoint is not currently used
 */

router.get('/', (req, res) => {
    Song.find({}).exec(function(err, songs) {
        res.status(200).json(songs);
    });
});

/**
 * Endpoint: used to `POST` a new song to the DB
 */

router.post('/', (req, res) => {
  var newSong = req.body;
  var song = new Song(newSong);
  song.save(function(err, songModel) {
      if (err) {
          return res.status(500).send(err);
      }
      res.status(201).send(songModel);
  })
});

/**
 * Endpoint: delete a song from the DB based on its Spotify ID
 * This should really be based on its Mongo _id. However at the moment
 * I'm doing it via the Spotify Id as I don't have a mongo _id yet in React/State as I add to my playlist first without saving to the DB.
 * So I don't have a mongo _id yet to use for deletion until I save to the DB later.
 * So at the moment I'm using the Spotify Id across everything until I switch to 
 * pessimistic updating and therefore only add to the playlist state once I know its saved in the DB.
 * I'll then be able to save the mongo _id in the song `document` straight away. Allowing for deletion immediatley after adding.
 */

router.delete('/:songspotid', (req, res) => {
    var songToDelete = req.params.songspotid;
    Song.deleteOne({ spotId : songToDelete }, function(err) {
        if (err) return handleError(err);
        res.sendStatus(204);
    });
});

/**
 * Endpoint: Not currently in use. May use it later in order for users to maybe give
 * a song a nickmae. But changing the song details provided by Spotify doesn't make sense.
 */
router.put('/songs/:songid', (req, res) => {
    var { songid } = req.body;
    Song.updateOne({ _id: songid }, req.body, function (err, raw) {
        if (err) return handleError(err);
        return res.sendStatus(200);
    });
});

module.exports = router;
