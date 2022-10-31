/** Facebook Login **/
var userLookup, createUser, postDataToExtension, extensionID, qsToJson, twitterLoginInit, notFound;

// facebook widget variables.
var statusChangeCallback, onLoginCallback;


//~ const facebook_app_id = '3926484217362094';
const facebook_app_id = '711837226095556';
var url = "https://api.afrometa.co";

notFound = function(email, username, name) {
	swal({
		title: "You are new to our site.",
		text: "Do you wish to Sign up with provided details.?",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	})
	.then((ok) => {
		if (ok) {
			createUser(email, username, name);
		} else {
			location.reload();
		}
	});
};

userLookup = function(email, name) {
	
	const username = email.split('@')[0];

	const data = { username: username, email: email, name: name };
	//~ if (!("https://www.afrometa.io" in location.href)) {
		//~ url = "http://127.0.0.1:8000";
	//~ }
	if ( !location.href.includes("https://www.afrometa.io") ) {
		url = "http://127.0.0.1:8000";
	}
	$.ajax({
		url: `${url}/api/v1/user/${username}`,
		type: 'GET',
		success: function(result) {
			console.log('success: ', result);
			if (result.status) {
				swal('User found. logging in.');
				postDataToExtension(data);
			} else {
				notFound(email, username, name);
			}
		},
		error: function(err) {
			notFound(email, username, name);
		}
	});
};


createUser = function (email, username, name) {
	const data = {
		username: username,
		email: email,
		name: name
	};

	if ( !location.href.includes("https://www.afrometa.io") ) {
		url = "http://127.0.0.1:8000";
	}

	$.ajax({
		url: `${url}/api/v1/user/create`,
		type: 'POST',
		data: data,
		success: function(result) {
			if (result.status) {
				swal('Yayyy', 'SignedUp Successfully', 'success');
				postDataToExtension(data);
			} else {
				swal('There is some error signing Up.', 'Please contact site admin', 'error');
			}
		},
		error: function(err) {
			console.log('Error: ', err);
		}
	});
};


postDataToExtension = function(data) {
	const extension_id = extensionID(location.href);

	const encode_data = btoa(JSON.stringify(data));
	const e_url = `chrome-extension://${extension_id}/views/loginSuccess.html?data=${encode_data}`;
	location.href = e_url;
};


qsToJson = function() {
	const search = location.search.substring(1);
	return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
}


extensionID = function(url = location.href) {
	const qs = qsToJson();
	return qs.id;
}


function initFb() {

	$('body').prepend(`
		<div id="fb-root"></div>
		<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v8.0&appId=${facebook_app_id}&autoLogAppEvents=1" nonce="WRghmzyl"></script>
	`);

	window.fbAsyncInit = function() {

		// response handle
		statusChangeCallback = function(response) {
			if (response.status == "connected") {
				console.log('Facebook connected.');

				FB.api('/me', { locale: 'en_US', fields: 'name, email, gender' },
					function(response) {
						
						const email = response.email;
						const name = response.name;

						userLookup(email, name);
					}
				);
			} else {
				swal('Not logged-in', 'Please click on Login Button to start Process.', 'error');
			}
		};
		// response handle end.

		FB.init({
			appId      : facebook_app_id,
			cookie     : true,
			xfbml      : true,
			version    : 'v8.0'
		});

		FB.AppEvents.logPageView();

		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	};

	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "https://connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));


	onLoginCallback = function(data) {

		if (data.status == "connected") {
			FB.api('/me', { locale: 'en_US', fields: 'name, email, gender' },
				function(response) {
					
					const email = response.email;
					const name = response.name;

					userLookup(email, name);
				}
			);
		} else {
			swal('Error logging in');
		}
		
	}
}

function fbPostInit() {
	$("#fb-area").show();
}


/**
* Twitter init.
*/
function initTw() {
	$('#tw-area').append(`
		<button 
		type="button" 
		id="tw-login-init" 
		class="btn btn-block btn-twitter auth-form-btn"
		onclick="twitterLoginInit()"
		>
			<i class="mdi mdi-twitter mr-2"></i>Signin with Twitter
		</button>
	`).show();
	$('#tw-login-init').trigger('click');
}


twitterLoginInit = function() {
	location.href = '/auth/twitter';
}
