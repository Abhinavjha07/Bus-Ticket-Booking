const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new mongoose.Schema({
	username: { type: String, unique: true, required: 'This field is required.' },
	fullName: String,
	phone: { type: String, unique: true, required: true },
	email: { type: String, unique: true, required: true }
});

UserSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);