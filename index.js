/** Modules import **/
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

const http = require('http').createServer(app);
const io = require('socket.io')(http);


/** Custom File Exports. **/
global.UserModules = require('./custom_modules');
global.Config = require('./config');


/** 
* require database.
*/
const db = require('./db/Database');
const users = require('./routes/users');



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



/**
* Static Files Path.
*/
app.use(express.static('public'));


/**
* Route.
*/
app.get('/', RouteListener.indexRoute);



/**
* Server.
*/
http.listen(global.Config.serverPort, global.Config.host, ServerListener.Server);



/**
* Socket incoming and outgoing Listener.
* Binding io with callback. It requires to emit messages.
*/
io.on('connection', SocketListener.IoListener.bind({ 'io': io }));