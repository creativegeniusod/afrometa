var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


var port = 3000;


app.use(express.static('public'));
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/templates/index.html');
});


http.listen(port, () => {
	console.log(`Example app listening at http://0.0.0.0:${port}`)
});





const activeUsers = new Set();

io.on('connection', (socket) => {
	
	console.log("Connection established with new user.");


	socket.on("new user", function (data) {
		socket.userId = data;
		activeUsers.add(data);
		io.emit("new user", [...activeUsers]);
	});


	socket.on("disconnect", () => {
		activeUsers.delete(socket.userId);
		io.emit("user disconnected", socket.userId);
	});


	socket.on("chat message", function (data) {
		io.emit("chat message", data);
	});

	socket.on("typing", function (data) {
		socket.broadcast.emit("typing", data);
	});
});
