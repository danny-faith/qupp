const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
    // unique: true,
    // required: [true, "can't be blank"],
    // match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
    // index: true
  },
  email: {
    type: String,
    required: true
    // lowercase: true,
    // unique: true, 
    // required: [true, "can't be blank"], 
    // match: [/\S+@\S+\.\S+/, 'is invalid'], 
    // index: true
  },
  avatar: {
    type: String
  },
  bio: String,
  password: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordTokenExpires: Date
  // image: {
  //   type: String,
  //   default: 'https://bodiezpro.com/wp-content/uploads/2015/09/medium-default-avatar.png'
  // },
  // hash: String,
  // salt: String
}, {timestamps: true});

module.exports = User = mongoose.model('users', UserSchema);