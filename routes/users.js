const express = require('express');
const router = express.Router();

const user = require('../controllers/users');


router.post('/create', (req, res) => {
	user.create(req, res);
});

router.post('/login', (req, res) => {
	user.find(req, res);
});


router.get('/', (req, res) => {
	user.list(req, res);
});


module.exports = router;