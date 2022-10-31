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
* update a record.
*/
exports.update = (req, res) => {
	User.updateOne(req.body.filter, req.body).exec((err, response) => {
		if (err) {
			return res.status(500).send(err);
		}
		delete req.body.filter;
		return res.status(200).send({ modified: response.nModified, user: req.body });
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
		return res.status(200).send(users);
	});
};


/**
* Return Online Users on a webpage.
*/
exports.online = (req, res) => {
	const data = req.body;
	delete global.activeUsers[data.user];
	const online_users = global.activeUsers;
	var siteHasUsersOnline = false;
	if (Object.keys(online_users).length > 0) {
		for (online_user in online_users) {
			var user = online_users[online_user];
			if (user.site == data.site) {
				siteHasUsersOnline = true;
				break;
			}
		}
	}
	
	return res.status(200).send(siteHasUsersOnline);
};