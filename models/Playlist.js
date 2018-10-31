const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playlistSchema = new Schema({
    name: String,
    desc: String,
    createdAt : {
        type: Date,
        default: Date.now
    }
});

var Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;


// var Artist = mongoose.model('Artist', artistSchema);