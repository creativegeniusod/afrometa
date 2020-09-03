var Helpers, Html, Render, Validate, User, Socket;
Helpers = {

	/** 
	* Check UserBox is appended on page or not.
	*/
	checkUserChatBox: (user) => {
		const user_chat_box = document.getElementsByClassName(`chat-${user}`);

		if (user_chat_box.length == 0) Render.renderChatBox(Html.userChatBox(user, `none`));
	},

	/**
	* User Notification.
	*/
	userMessageNotification: (user) => {
		const user_chat_box = $(`.chat-${user}`);
		const notification_icon = $(`.${user}-userlist`).find(`.message-notify`);
		
		if (!user_chat_box.hasClass(`active`) && notification_icon.length == 0) {
			Render.showNotification(user, Html.notificationHtml(user));
		}
	},


	/**
	* Update user list.
	*/
	updateUserList: (inboxPeople, userName) => {
		if (!!document.querySelector(`.${userName}-userlist`)) {
			return;
		}

		if (userName != $(`#me`).data(`me`)) {
			Render.updateUsersOnlineList(inboxPeople, Html.userIsOnline(userName));
		}
	},
};


Html = {

	/**
	* Create User Chat Box Html.
	*/
	userChatBox: (user, display) => {
		return `<div class="user-chatbox chat-${user}" data-user="${user}" style="display: ${display};">
				<div class="user-name">${user}</div>
				<div class="user-messages">&nbsp;</div>
			</div>
		`;
	},

	notificationHtml: (user) => {
		const ele = $(`.${user}-userlist h5`).html();
		return `
			<span class="message-notify">*</span>
			${ele}
		`;
	},


	/**
	* User Online.
	*/
	userIsOnline: (userName) => {
		return `
			<div class="chat_ib ${userName}-userlist" data-user-id="${userName}">
				<h5>${userName}</h5>
			</div>
		`;
	},
};


Render = {

	/**
	* Render chatBox On page.
	*/
	renderChatBox: (html) => {
		$(`.messages__history`).append(html);
	},


	/**
	* Render Notification Icon.
	*/
	showNotification: (user, html) => {
		$(`.chat_ib.${user}-userlist h5`).html(html);
	},


	/**
	* Update attrs on page.
	*/
	updateUserDataOnPage: (userName) => {
		$(`#me`).attr(`data-me`, userName);
		$(`.iam b`).html(userName);
	},


	/**
	* Render users online list.
	*/
	updateUsersOnlineList: (element, html) => {
		element.innerHTML += html;
	},
};


Validate = {

	/**
	* validate user to show messages.
	*/
	checkUserAuthorizationForData: (reciever) => {
		if (reciever == $(`#me`).data(`me`)){
			return true;
		}
		return false;
	},
};



User = {

	/**
	* New User Connected.
	*/
	newUserId: (socket, user) => {
		const userId = Math.floor((Math.random() * 100000) + 1);
		return user || `User${userId}`;
	},
};


Socket = {

	/**
	* Emit messages.
	*/
	emitMessage: (socket, type, data) => {
		socket.emit(type, data);
	},
}