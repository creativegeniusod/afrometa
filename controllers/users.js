const path = require('path');
const User = require('../models/users');



/**
* create a new user in database.
*/
exports.create = (req, res) => {
	var newUser = new User(req.body);

	newUser.save((err) => {
		var model_status = 200;
		const res_data = {
			message: 'User Created.',
			data: req.body
		};

		if (err) {
			res_data.message = "Error while saving user.";
			res_data.data = { error: err.keyValue, keyPattern: err.keyPattern };
			model_status = 400;
		}

		// response back.
		res.status(model_status).send(res_data);
	});
};


/**
* create a new user in database.
*/
exports.find = (req, res) => {
	User.find(req.body).exec((err, user) => {
		if (err) {
			return res.status(500).send(err);
		}
		if (user.length > 0) return res.status(200).send(user);
		else return res.status(400).send('Not Found');
	});
};



/**
* List all users from database.
*/
exports.list = (req, res) => {
	User.find({}).exec((err, users) => {
		if (err) {
			return res.status(500).send(err);
		}
		return res.status(200).send(users)
	});
};