const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');

router.get('/twitter', (req, res) => {
	auth.twitter(req, res);
});

// router.get('/tc', (req, res) => {
// 	auth.tc(req, res);
// });

module.exports = router;