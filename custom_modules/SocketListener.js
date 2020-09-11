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

		socket.on("new room", (data) => {
			io.emit("new room notify", data);
		});
		
		socket.on("chat room message", function (data) {
			io.emit("chat room message", data);
		});

		socket.on("new users in room", (data) => {
			io.emit("new users in room", data);
		});
	},

};