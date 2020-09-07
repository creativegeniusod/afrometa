const mongoose = require('mongoose');
const Database = require('./DatabaseConfig');


/**
* select user selected database.
*/
var env = 'dev';
if (process.argv[2] !== undefined) {
	env = process.argv[2];
}
console.log(`=======================================================`);
console.log(`Started in Environment: "${env}" ${env == 'dev' ? '(default)': ''}`);
console.log(`=======================================================\n`);


/**
* Database Credentials.
*/
// const db = Database.local;
const db = Database[env];


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