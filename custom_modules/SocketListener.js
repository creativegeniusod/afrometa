const activeUsers = new Set();

module.exports = {

	/**
	* Socket Listener Callback.
	*/
	IoListener: function(socket) {
		console.log("Connection established with new user.");
		const io = this.io;

		socket.on("new user", function (data) {
			socket.userId = data;
			console.log('username', data);
			activeUsers.add(data);
			io.emit("new user", [...activeUsers]);
			// io.emit("new user", data);
		});


		socket.on("disconnect", () => {
			activeUsers.delete(socket.userId);
			console.log('user disconnected', socket.userId);
			io.emit("user disconnected", socket.userId);
		});


		socket.on("chat message", function (data) {
			io.emit("chat message", data);
		});

		socket.on("typing", function (data) {
			socket.broadcast.emit("typing", data);
		});
	},

};