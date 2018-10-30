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

router.delete('/:songid', (req, res) => {
    var songToDelete = req.params.songid;
    // console.log('songToDelete: ', songToDelete);
    Song.deleteOne({ _id : songToDelete }, function(err) {
        if (err) return handleError(err);
        res.sendStatus(204);
    });
});

module.exports = router;
