module.exports = {

	/**
	* Socket Listener Callback.
	*/
	indexRoute: function(req, res) {
		res.sendFile(`${global.Config.templatesPath}/index.html`);
	},

};