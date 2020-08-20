var Helpers, Html, Render;
Helpers = {

	/** 
	* Check UserBox is appended on page or not.
	*/
	checkUserChatBox: function(user) {
		const user_chat_box = document.getElementsByClassName(`chat-${user}`);

		if (user_chat_box.length == 0) Render.renderChatBox(Html.userChatBox(user, 'none'));
	},

	/**
	* User Notification.
	*/
	userMessageNotification: function(user) {
		const user_chat_box = $(`.chat-${user}`);
		const notification_icon = $(`.${user}-userlist`).find('.message-notify');
		
		if (!user_chat_box.hasClass('active') && notification_icon.length == 0) {
			Render.showNotification(user, Html.notificationHtml(user));
		}
	},
};


Html = {

	/**
	* Create User Chat Box Html.
	*/
	userChatBox: function(user, display) {
		return `
			<div class="user-chatbox chat-${user}" data-user="${user}" style="display: ${display};">
				<div class="user-name">${user}</div>
				<div class="user-messages">&nbsp;</div>
			</div>
		`;
	},

	notificationHtml: function(user) {
		const ele = $(`.${user}-userlist h5`).html();
		return `
			<span class="message-notify">*</span>
			${ele}
		`;
	}
};


Render = {

	/**
	* Render chatBox On page.
	*/
	renderChatBox: function(html) {
		$(".messages__history").append(html);
	},


	showNotification: function(user, html) {
		$(`.chat_ib.${user}-userlist h5`).html(html);
	},
};


var Validate = {

	/**
	* validate user to show messages.
	*/
	checkUserAuthorizationForData: function(reciever) {
		if (reciever == $("#me").data("me")) {
			return true;
		}
		return false;
	},
};