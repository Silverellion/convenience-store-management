const express = require('express');
const router = express.Router();
const signinController = require('../controllers/signin.controller');
const path = require('path');

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'html', 'login.html'));
});

router.post('/login', signinController.login);

module.exports = router;
