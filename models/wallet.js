const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/**
* User Schema.
*/
const Wallet = new Schema({
	activeType: { type: String, required: true },
	whiteListedNFTaddresses: { type: Array, required: false },
},{collection: 'wallet'});


/**
* User Model.
*/
module.exports = mongoose.model('Wallet', Wallet);


