const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
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
	resetPasswordTokenExpires: Date,
	online: {
		type: Boolean,
		default: false
	},
	lastOnline: {
		type: Date,
		default: Date.now
	}
}, {timestamps: true});

module.exports = User = mongoose.model('users', UserSchema);