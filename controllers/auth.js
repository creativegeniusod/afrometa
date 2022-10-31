const path = require('path');
const LoginWithTwitter = require('login-with-twitter');
const fetch = require('node-fetch');


// From package.
const crypto = require('crypto')
const get = require('simple-get')
const OAuth = require('oauth-1.0a')
const querystring = require('querystring')

global.ts;
var verify_credentials, toHeaders;

const tw = new LoginWithTwitter({
	consumerKey: global.Config.TwitterConsumerKey,
	consumerSecret: global.Config.TwitterConsumerSecret,
	callbackUrl: global.Config.TwitterCallbackUrl
});


/**
* Start Twitter Login Process.
*/
exports.twitter = (req, res) => {
	console.log('Callback URL: ', global.Config.TwitterCallbackUrl)
	tw.login((err, tokenSecret, url) => {
		if (err) {
			console.log('url: ', url)
			console.log('error: ', err)
			res.status(400).send({ status: false, message: 'Error Response', data: err });
			return;
		}

		global.ts = tokenSecret;
		res.redirect(url);
	});
};


/**
* Twitter Login Process Callback.
*/
exports.twitterCallback = (req, res) => {
	const oauth_token = req.query.oauth_token
	tw.callback({
		oauth_token: oauth_token,
		oauth_verifier: req.query.oauth_verifier
	}, global.ts, (err, user) => {
		if (err) {
			res.status(400).send({ status: false, message: 'Error Response 1', data: err });
			return;
		} else {
			const data = {
				user: user,
				auth_source: 'tw'
			};

			if (global.Config.RequestUserEmail) {

				verify_credentials(req, res, oauth_token, global.ts, user);
			} else {
				
				const encoded_data = Buffer.from(JSON.stringify(data)).toString('base64');
				res.redirect(`chrome-extension://${global.extension_id}/views/loginSuccess.html?data=${encoded_data}`);
			}
		}
	});
};


/** verify **/
verify_credentials = (req, res, access_token, access_token_secret, user) => {
	const VERIFY_CREDS = "https://api.twitter.com/1.1/account/verify_credentials.json";
	const requestData = {
      url: `${VERIFY_CREDS}?include_email=true`,
      method: 'GET',
      params: {
      	include_email: true
      }
    };

    _oauth = OAuth({
      consumer: {
        key: global.Config.TwitterConsumerKey,
        secret: global.Config.TwitterConsumerSecret
      },
      signature_method: 'HMAC-SHA1',
      hash_function: (baseString, key) => {
        return crypto.createHmac('sha1', key).update(baseString).digest('base64')
      }
    });

    const headers_data = _oauth.authorize(requestData);
    headers_data.oauth_token = access_token;
    
    const oauth_signature = crypto.createHmac('sha1', global.Config.TwitterConsumerKey)
    .update(_oauth.getBaseString(requestData, headers_data))
    .digest('base64')
    headers_data.oauth_signature = oauth_signature;
    
    const headers = toHeaders(_oauth, headers_data);

    fetch(requestData.url, {
    	method: requestData.method,
    	headers: headers,
    })
    .then(res => res.json())
    .then(json => {
    	console.log(json)
    	res.status(200).send({ status: true, message: 'Success Response', data: json });
    });

 //    get.concat({
	// 	url: requestData.url,
	// 	method: requestData.method,
	// 	// form: requestData.data,
	// 	headers: headers
	// }, (err, res, data) => {
	// 	if (err) console.log('error: ', err);
	// 	else {
	// 		console.log(data )
	// 	}

		
	// })
};


toHeaders = (_oauth, headers) => {
	var sorted = _oauth.sortObject(headers);

	parameter_seperator = ', ';
	var header_value = 'OAuth ';
	for(var i = 0; i < sorted.length; i++) {

        header_value += _oauth.percentEncode(sorted[i].key) + '="' + _oauth.percentEncode(sorted[i].value) + '"' + parameter_seperator;
    }
    return {
        Authorization: header_value.substr(0, header_value.length - parameter_seperator.length) //cut the last chars
    };
}
