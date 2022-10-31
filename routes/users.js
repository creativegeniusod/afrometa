const express = require('express');
const router = express.Router();
var path = require('path');
const user = require('../controllers/users');
const web3functions = require('../controllers/web3functions');
const Wallet = require('../models/wallet');


// router.post('/create', (req, res) => {
// 	user.create(req, res);
// });

router.post('/login', (req, res) => {
	// user.find(req, res);
});

router.post('/user/lookup', (req, res) => {
	// user.find(req, res);
});

// router.post('/update', (req, res) => {
// 	user.update(req, res);
// });

router.use('/web3-page', (req, res) => {
	res.sendFile(path.resolve('templates/web3.html'));
});
router.use('/web3-nonce', (req, res) => {
	web3functions.nonce(req,res)
});
router.use('/web3-auth', (req, res) => {
	web3functions.auth(req,res)
});
router.get('/wallet-status', (req, res) => {
	web3functions.getwalletStatus(req,res);
});
router.post('/wallet-status', (req, res) => {
	web3functions.setwalletactiveTypeStatus(req,res);
});
router.post('/wallet-whitelist-add', (req, res) => {
	web3functions.setwalletwhitelistAdd(req,res);
});
router.post('/wallet-whitelist-remove', (req, res) => {
	web3functions.setwalletwhitelistRemove(req,res);
});
router.get('/web3-wc-page', (req, res) => {
	res.sendFile(path.resolve('templates/web3-wc.html'));
});

router.get('/', (req, res) => {
	user.list(req, res);
});

router.post('/online', (req, res) => {
	user.online(req, res);
});



module.exports = router;
