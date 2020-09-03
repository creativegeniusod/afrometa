const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/**
* User Schema.
*/
const User = new Schema({
	name: { type: String, required: false },
	username: { type: String, required: true, unique: true, index: true },
	online: { type: Boolean, required: false }
});


/**
* User Model.
*/
module.exports = mongoose.model('User', User);


