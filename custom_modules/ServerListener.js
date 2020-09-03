module.exports = {

	/**
	* Socket Listener Callback.
	*/
	Server: function() {
		console.log(`Server started at http://${global.Config.host}:${global.Config.serverPort}`);
	},
};