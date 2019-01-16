const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = "secret";

/**
 * uniqueValidator adds the following properties to the User shcema
 * index: Indexes the field for faster look ups
 * match: string validation
 * required: sets field to required and sets a message to return if not set
 * unique: stops duplicate users being added
 */

var userSchema = new mongoose.Schema({
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
  }
  // image: {
  //   type: String,
  //   default: 'https://bodiezpro.com/wp-content/uploads/2015/09/medium-default-avatar.png'
  // },
  // hash: String,
  // salt: String
}, {timestamps: true});

/**
 * Set and validate password methods set on the User schema using default `crypto` package
 */

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

/**
 * Not currently in use: 
 * JSON Web token generate and check/auth methods added to User schema
 */

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

// userSchema.plugin(uniqueValidator, {message: 'is already taken.'}); // I believe sets message for unique property on User shcema
var User = mongoose.model('User', userSchema);

module.exports = User;