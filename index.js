/** Modules import **/
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

const router = express.Router();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
	transports: ['polling']
});



/** Custom File Exports. **/
global.UserModules = require('./custom_modules');
global.Config = require('./config');


/**
* require database.
*/
const db = require('./db/Database');
const users = require('./routes/users');
const index_routes = require('./routes/index');
const auth_routes = require('./routes/auth');



/**
* Custom Modules import.
* No need to worry about files path.
*/
RouteListener = global.UserModules.RouteListener;
SocketListener = global.UserModules.SocketListener;
ServerListener = global.UserModules.ServerListener;

/**
* Server Configuration.
*/
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/**
* Add Api paths to app.
*/
app.use('/users', users);
app.use('/', index_routes);
app.use('/auth', auth_routes);



/**
* Static Files Path.
*/
app.use(express.static('public'));


/**
* Route.
*/
app.get('/dumm', RouteListener.indexRoute);



/**
* Server.
*/
http.listen(global.Config.serverPort, global.Config.host, ServerListener.Server);



/**
* Socket incoming and outgoing Listener.
* Binding io with callback. It requires to emit messages.
*/
io.on('connection', SocketListener.IoListener.bind({ 'io': io }));
