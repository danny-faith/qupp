const express = require('express');
const Song = require('../../models/Song');
const router = express.Router();

/* GET home page. */

router.get('/', (req, res) => {
    Song.find({}).exec(function(err, songs) {
        res.status(200).json(songs);
    });
});

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

router.delete('/:songspotid', (req, res) => {
    var songToDelete = req.params.songspotid;
    Song.deleteOne({ spotId : songToDelete }, function(err) {
        if (err) return handleError(err);
        res.sendStatus(204);
    });
});

/* NOT CURRENTLY IN USE */
router.put('/songs/:songid', (req, res) => {
    var { songid } = req.body;
    Song.updateOne({ _id: songid }, req.body, function (err, raw) {
        if (err) return handleError(err);
        return res.sendStatus(200);
    });
});
/* NOT CURRENTLY IN USE */

module.exports = router;
