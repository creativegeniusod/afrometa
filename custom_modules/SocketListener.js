// const activeUsers = new Set();
global.activeUsers = {};

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

			const page = socket.request._query.page;
			const site = page.replace('http://','').replace('https://','').split(/[/?#]/)[0];
			// activeUsers.add({ username: data, page: page, site: site });
			global.activeUsers[data] = { username: data, page: page, site: site, disconnect: 0 };

			console.log('activeUsers: ', global.activeUsers);
			io.emit("new user", global.activeUsers);
			
		});


		socket.on("disconnect", () => {
			if (global.activeUsers[socket.userId] !== undefined) {
				var disconnectCounter = global.activeUsers[socket.userId].disconnect + 1;
				global.activeUsers[socket.userId].disconnect = disconnectCounter;

				console.log("disconnect counter: ", global.activeUsers[socket.userId].disconnect);

				if ('disconnect' in global.activeUsers[socket.userId]) {
					var close_after = 0;
					const check_disconnect = setInterval(() => {

						io.emit("confirm user disconnect", socket.userId);
						
						close_after += 1;
						if ( close_after > 2 ) {
							clearInterval(check_disconnect);
							if (global.activeUsers[socket.userId].disconnect >= 3) {
								// activeUsers.delete(socket.userId);
								delete global.activeUsers[socket.userId];
								io.emit("user disconnected", socket.userId);
								console.log("disconnected user: ", socket.userId);
							}
						} else {
							console.log('*******', socket.userId);
							if ( 'disconnect' in global.activeUsers[socket.userId]) {
								disconnectCounter = global.activeUsers[socket.userId].disconnect + 1;
							} else disconnectCounter = 1;
						}
					}, 1500);
				}

				// if (disconnectCounter >= 3) {
				// 	// activeUsers.delete(socket.userId);
				// 	delete activeUsers[socket.userId];
				// 	io.emit("user disconnected", socket.userId);
	
				// 	console.log("disconnected user: ", user);
				// }
			}
		});

		socket.on("disconnectStatus", (user) => {
			
			if (global.activeUsers[user] !== undefined) {
				const disconnectCounter = global.activeUsers[user].disconnect;
				if (disconnectCounter > 0) {
					global.activeUsers[user].disconnect = disconnectCounter - 1;
				} else {
					global.activeUsers[user].disconnect = 0;
				}
			}
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
		
		socket.on("page_room_new_user", (data) => {
			io.emit("page_room_new_user", data);
		});
	},

};
