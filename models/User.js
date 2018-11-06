const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
var jwt = require('jsonwebtoken');
// var secret = require('../config/index').secret;
var secret = "secret";


var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {type: String, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  bio: String,
  image: {
    type: String,
    default: 'https://bodiezpro.com/wp-content/uploads/2015/09/medium-default-avatar.png'
  },
  hash: String,
  salt: String
}, {timestamps: true});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
  // return true;
};

userSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

userSchema.methods.toAuthJSON = function() {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image
  };
};
  
userSchema.plugin(uniqueValidator, {message: 'is already taken.'});
var User = mongoose.model('User', userSchema);

module.exports = User;