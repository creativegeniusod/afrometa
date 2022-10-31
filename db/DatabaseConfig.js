module.exports = {

	local: {
		USERNAME: 'chat_room',
		PASSWORD: 'admin123',
		HOSTNAME: '127.0.0.1',
		PORT: '27017',
		DB: 'chat_room',
		AUTH_SOURCE: 'chat_room'
	},


	dev: {
		USERNAME: process.env.DB_UN,
		PASSWORD: process.env.DB_PWD,
		HOSTNAME: process.env.DB_HOST,
		PORT: process.env.DB_PORT,
		DB: process.env.DB_NAME,
		AUTH_SOURCE: process.env.DB_AUTH_SOURCE
	},

	prod: {
		USERNAME: process.env.DB_UN,
		PASSWORD: process.env.DB_PWD,
		HOSTNAME: process.env.DB_HOST,
		PORT: process.env.DB_PORT,
		DB: process.env.DB_NAME,
		AUTH_SOURCE: process.env.DB_NAME
	},

	test: {
		USERNAME: 'chat_room_test',
		PASSWORD: 'admin123',
		HOSTNAME: '127.0.0.1',
		PORT: '27017',
		DB: 'chat_room',
		AUTH_SOURCE: 'chat_room_test'
	}
};
