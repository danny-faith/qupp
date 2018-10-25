const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artistSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

var songSchema = new Schema({
    spotId: {
        type: String,
        unique : true,
        required : true,
        dropDups: true
    },
    name: {
        type: String,
        required : true
    },
    duration: Number,
    artists: [artistSchema],
    uri: String,
    album: String,
    image: String
});


var Song = mongoose.model('Song', songSchema);

module.exports = Song;


// var Artist = mongoose.model('Artist', artistSchema);