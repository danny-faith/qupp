const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    type: {
        type: String,
        default: 'duo'
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
    users: {
        type: Array,
        required: true
    }
});

module.exports = Message = mongoose.model('Message', messageSchema);
