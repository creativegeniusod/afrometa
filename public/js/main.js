$(function () {
	const socket = io();

	const inboxPeople = document.querySelector('.inbox__people');
	const inputField = document.querySelector('.message_form__input');
	const messageForm = document.querySelector('.message_form');
	const messageBox = document.querySelector('.messages__history');
	const fallback = document.querySelector('.fallback');

	/**
	* New User. Generates Id.
	*/
	var userName = User.newUserId();


	/**
	* Update User Html Attrs.
	*/
	Render.updateUserDataOnPage(userName);


	/**
	* Emit Messages on socket.
	*/
	Socket.emitMessage(socket, 'new user', userName);


	/**
	* Update Users Online list.
	*/
	Helpers.updateUserList(inboxPeople, userName);

	

	const addNewMessage = ({ from_user, message, to }) => {
		const time = new Date();
		const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

		const receivedMsg = `
			<div class="incoming__message">
				<div class="received__message">
					<p class="message__message">${message}</p>
					<div class="message__info">
						<span class="message__author">${from_user}</span>
						<span class="time_date">${formattedTime}</span>
					</div>
				</div>
			</div>
		`;

		const myMsg = `
			<div class="outgoing__message">
				<div class="sent__message">
					<p class="message__message">${message}</p>
					<div class="message__info">
						<span class="time_date">${formattedTime}</span>
					</div>
				</div>
			</div>
		`;

		// me.
		var myself = $(`#me`).data(`me`);

		user_message = from_user === myself ? myMsg : receivedMsg;

		if ( to == myself ) {

			// check if chatBox is created or not.
			Helpers.checkUserChatBox(from_user);

			// notification for non active user.
			Helpers.userMessageNotification(from_user);


			$(`.chat-${from_user} .user-messages`).append(user_message);
			

		} else if (from_user == myself) {
			$(`.chat-${to} .user-messages`).append(user_message);
		}

	};


	messageForm.addEventListener(`submit`, (e) => {
		e.preventDefault();
		if (!inputField.value) {
			return;
		}

		var from = $(`#me`).data(`me`);
		var to = $(`.user-chatbox.active`).data(`user`);

		socket.emit(`chat message`, {
			message: inputField.value,
			from: from,
			to: to,
			time_of_message: new Date(),
			channelId: btoa(`${from}-0-${to}`)
		});

		inputField.value = "";
	});

	inputField.addEventListener(`keyup`, () => {
		var to = $(`.user-chatbox.active`).data(`user`);
		socket.emit(`typing`, {
			isTyping: inputField.value.length > 0,
			user: userName,
			typingTo: to
		});
	});




	socket.on(`new user`, function(data) {
		data.map((user) => Helpers.updateUserList(inboxPeople, user));
	});

	socket.on(`user disconnected`, function(userName) {
		document.querySelector(`.${userName}-userlist`).remove();
	});

	socket.on(`chat message`, function(data) {
		addNewMessage({ from_user: data.from, message: data.message, to: data.to });
	});

	socket.on(`typing`, function(data) {
		const { isTyping, user, typingTo } = data;

		if (!isTyping) {
			fallback.innerHTML = "";
			return;
		}

		if ( Validate.checkUserAuthorizationForData(typingTo) ) {
			fallback.innerHTML = `<p>${user} is typing...</p>`;
		}
	});
});