app.get('/songs', (req, res) => {
    Song.find({}).exec(function(err, songs) {
        res.status(200).json(songs);
    });
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