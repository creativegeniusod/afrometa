const mongoose = require('mongoose');
const Database = require('./DatabaseConfig');


/**
* select user selected database.
*/
var env = 'prod';
if (process.argv[2] !== undefined) {
	env = process.argv[2];
}
console.log(`=======================================================`);
console.log(`Started in Environment: "${env}" ${env == 'prod' ? '(default)': ''}`);
console.log(`=======================================================\n`);


/**
* Database Credentials.
*/
const db = Database.local;


/**
* Connection String.
*/
const url = `mongodb://${db.USERNAME}:${db.PASSWORD}@${db.HOSTNAME}:${db.PORT}/${db.DB}?authSource=${db.AUTH_SOURCE}`;


/**
* Connect to database.
*/
const Options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
};
mongoose.connect(url, Options);