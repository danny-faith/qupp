const mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    collaborative:  {
        type: Boolean,
        default: true
    },
    share_link: String,
    desc: String,
    createdAt : {
        type: Date,
        default: Date.now
    }
});

module.exports = Playlist = mongoose.model('Playlist', playlistSchema);
