$(function () {

	var chatBoxHtml;

	$(document).on("click", ".chat_ib", function(event) {
		var _self = $(this);
		var user_name = _self.data("user-id");
		

		// hide existing chatboxes
		$(".user-chatbox").removeClass("active").hide();

		// create/show user chatBoxes
		if ($(".chat-"+ user_name).length == 0) {
			$(".messages__history").append(chatBoxHtml(user_name));
		} else {
			$(".user-chatbox.chat-"+ user_name).addClass("active").show();
		}

		// remove notification icon.
		$(`.${user_name}-userlist`).find(`.message-notify`).remove();
		
	});


	// ChatBox Html
	chatBoxHtml = function(user_name) {
		var chatBox = `<div class="user-chatbox active chat-${user_name}" data-user="${user_name}">
			<div class="user-name">${user_name}</div>
			<div class="user-messages">&nbsp;</div>
		</div>`;
		return chatBox;
	};
});