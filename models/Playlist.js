const mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Schema: Not currently used. But will be later in order to create new playlist per user in a differet section of the qupp site.
 * More settings are likely within this schema
 */

var playlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    desc: String,
    createdAt : {
        type: Date,
        default: Date.now
    }
});

module.exports = Playlist = mongoose.model('Playlist', playlistSchema);
