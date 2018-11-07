const mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Schema: Not currently used. But will be later in order to create new playlist per user in a differet section of the qupp site.
 * More settings are likely within this schema
 */

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