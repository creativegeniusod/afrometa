const express = require('express');
const router = express.Router();
const path = require('path');
const LoginWithTwitter = require('login-with-twitter');

const auth = require('../controllers/auth');

global.extension_id;

router.use((req, res, next) => {
	console.log('/' + req.method);
	next();
});


/**
* Start Social Login Process.
*/
router.get('/extension-login', (req, res) => {
	global.extension_id = req.query.id;
	res.sendFile(path.resolve('templates/login.html'));
});


/**
* Twitter Callback.
*/
router.get('/twitter-callback', (req, res) => {
	auth.twitterCallback(req, res);
});

router.get('/tc', (req, res) => {
	auth.tc(req, res);
});


router.get('/', (req, res) => {
	res.sendFile(path.resolve('templates/error.html'));
});

router.get('/privacy-policy', (req, res) => {
	res.sendFile(path.resolve('templates/privacy-policy.html'));
});

router.get('/terms', (req, res) => {
	res.sendFile(path.resolve('templates/terms.html'));
});

router.get('/data-deletion-url', (req, res) => {
	res.status(400).send({ status: true, message: 'Data Deletion URL' });
});

module.exports = router;