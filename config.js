const config = {};

/**
* APP url, local or live
*/
global.app_url = 'https://www.afrometa.io/';
global.db_app_url = 'https://api.afrometa.co/';
if (process.argv[2] !== undefined && process.argv[2] == 'local') {
	global.app_url = 'http://127.0.0.1:3000/';
	global.db_app_url = 'http://127.0.0.1:8000/';
}

/**
* Server Configuration.
*/
config.serverPort = 3000;
config.host = '0.0.0.0';
config.templatesPath = `${__dirname}/templates`;
config.customModules = `${__dirname}/custom_modules`;


/**
* Twitter Credentials.
**/
config.TwitterConsumerKey = `TppjjQdARIAoNfN0IwASCkeVD`;
config.TwitterConsumerSecret = `PzLCqSsVbbbXq8Pc4nEJyDeU5k6ZoMypi4330Sd8aDDEHmQBjd`;
config.TwitterCallbackUrl = `${global.app_url}twitter-callback`;
config.RequestUserEmail = false;

/**
* Wallet Credentials.
**/

config.serverUrl="https://gkmfrvwwyusr.usemoralis.com:2053/server";
config.appId="OV1gZMOR4B3pKfPAldtjHnbQWG1ywOHV9kgTfk1a";
config.chain="0x1";
config.saltHash="fKlLT1Unp1UePPouKG3cDU2MzkeNijPNAritZiWq1WCa8S0zhHxUiYPJZvYf";
config.rpcUrl='https://cloudflare-eth.com/';
config.walletUsernameKey='@wallet';
config.walletEmailKey='@walletuser.com';

module.exports = config;
